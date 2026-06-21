const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits,
    ChannelType,
    MessageFlags
} = require("discord.js");

const TicketSetup = require("../../schemas/ticketSetupSystem");

module.exports = {
    usableInDms: false,
    category: "Server Utils",
    permissions: [PermissionFlagsBits.Administrator],

    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Setup the ticket system.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Channel to send the ticket panel")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )

        .addChannelOption(option =>
            option
                .setName("category")
                .setDescription("Category for ticket channels")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        )

        .addChannelOption(option =>
            option
                .setName("transcripts")
                .setDescription("Channel for transcripts")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
        )

        .addRoleOption(option =>
            option
                .setName("handlers")
                .setDescription("Ticket handler role")
                .setRequired(true)
        )

        .addRoleOption(option =>
            option
                .setName("everyone")
                .setDescription("Everyone role")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("Embed description")
                .setRequired(true)
        )

        // Button 1
        .addStringOption(option =>
            option
                .setName("button1")
                .setDescription("First button text")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("emoji1")
                .setDescription("First button emoji")
                .setRequired(true)
        )

        // Button 2
        .addStringOption(option =>
            option
                .setName("button2")
                .setDescription("Second button text")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("emoji2")
                .setDescription("Second button emoji")
                .setRequired(false)
        )

        // Button 3
        .addStringOption(option =>
            option
                .setName("button3")
                .setDescription("Third button text")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("emoji3")
                .setDescription("Third button emoji")
                .setRequired(false)
        ),

    async execute(interaction, client) {

        const { guild, options } = interaction;

        try {

            const channel = options.getChannel("channel");
            const category = options.getChannel("category");
            const transcripts = options.getChannel("transcripts");

            const handlers = options.getRole("handlers");
            const everyone = options.getRole("everyone");

            const description = options.getString("description");

            const button1 = options.getString("button1");
            const emoji1 = options.getString("emoji1");

            const button2 = options.getString("button2");
            const emoji2 = options.getString("emoji2");

            const button3 = options.getString("button3");
            const emoji3 = options.getString("emoji3");

            await TicketSetup.findOneAndUpdate(
                {
                    GuildID: guild.id
                },
                {
                    Channel: channel.id,
                    Category: category.id,
                    Transcripts: transcripts.id,
                    Handlers: handlers.id,
                    Everyone: everyone.id,

                    Description: description,

                    Buttons: [
                        {
                            label: button1,
                            emoji: emoji1
                        },

                        ...(button2 ? [{
                            label: button2,
                            emoji: emoji2
                        }] : []),

                        ...(button3 ? [{
                            label: button3,
                            emoji: emoji3
                        }] : [])
                    ]
                },
                {
                    new: true,
                    upsert: true
                }
            );

            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("🎫 Ticket System")
                .setDescription(description)
                .setTimestamp();

            const buttons = [];

            buttons.push(
                new ButtonBuilder()
                    .setCustomId(`ticket_${button1}`)
                    .setLabel(button1)
                    .setEmoji(emoji1)
                    .setStyle(ButtonStyle.Primary)
            );

            if (button2 && emoji2) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(`ticket_${button2}`)
                        .setLabel(button2)
                        .setEmoji(emoji2)
                        .setStyle(ButtonStyle.Success)
                );
            }

            if (button3 && emoji3) {
                buttons.push(
                    new ButtonBuilder()
                        .setCustomId(`ticket_${button3}`)
                        .setLabel(button3)
                        .setEmoji(emoji3)
                        .setStyle(ButtonStyle.Secondary)
                );
            }

            const row = new ActionRowBuilder().addComponents(buttons);

            const ticketChannel = guild.channels.cache.get(channel.id);

            await ticketChannel.send({
                embeds: [embed],
                components: [row]
            });

            const successEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Ticket System Created")
                .setDescription("The ticket panel was successfully created.")
                .addFields(
                    {
                        name: "Ticket Channel",
                        value: `<#${channel.id}>`,
                        inline: true
                    },
                    {
                        name: "Category",
                        value: `<#${category.id}>`,
                        inline: true
                    },
                    {
                        name: "Transcripts",
                        value: `<#${transcripts.id}>`,
                        inline: true
                    },
                    {
                        name: "Handlers",
                        value: `<@&${handlers.id}>`,
                        inline: true
                    },
                    {
                        name: "Everyone",
                        value: `<@&${everyone.id}>`,
                        inline: true
                    }
                )
                .setFooter({
                    text: `Created by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp();

            return interaction.reply({
                embeds: [successEmbed]
            });

        } catch (err) {

            console.log(err);

            const errEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("Something went wrong")
                .setDescription(
                    "There was an error while creating the ticket system."
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [errEmbed],
                flags: MessageFlags.Ephemeral
            });
        }
    }
};
