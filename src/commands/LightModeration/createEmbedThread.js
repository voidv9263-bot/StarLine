const {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags,
    PermissionsBitField,
    PermissionFlagsBits
} = require('discord.js');

const timeout = [];

module.exports = {
    usableInDms: false,
    category: "Server Utils",
    permissions: [PermissionFlagsBits.ManageMessages],

    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Creates threads & embeds for you.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)

        .addSubcommand(command =>
            command
                .setName('embed')
                .setDescription('Creates an embed with specified values for you.')

                .addStringOption(option =>
                    option
                        .setName('title')
                        .setDescription("Embed's preferred title.")
                        .setRequired(true)
                        .setMaxLength(200)
                )

                .addStringOption(option =>
                    option
                        .setName('description')
                        .setDescription("Embed description. Use \\n for line breaks.")
                        .setRequired(true)
                        .setMaxLength(4096)
                )

                .addStringOption(option =>
                    option
                        .setName("color")
                        .setDescription("Specified color will be used for the embed.")
                        .setRequired(true)
                        .addChoices(
                            { name: "• Aqua", value: "#00FFFF" },
                            { name: "• Blurple", value: "#7289DA" },
                            { name: "• Fuchsia", value: "#FF00FF" },
                            { name: "• Gold", value: "#FFD700" },
                            { name: "• Green", value: "#008000" },
                            { name: "• Grey", value: "#808080" },
                            { name: "• Greyple", value: "#7D7F9A" },
                            { name: "• Light-grey", value: "#D3D3D3" },
                            { name: "• Luminous-vivid-pink", value: "#FF007F" },
                            { name: "• Navy", value: "#000080" },
                            { name: "• Not-quite-black", value: "#232323" },
                            { name: "• Orange", value: "#FFA500" },
                            { name: "• Purple", value: "#800080" },
                            { name: "• Red", value: "#FF0000" },
                            { name: "• White", value: "#FFFFFF" },
                            { name: "• Yellow", value: "#FFFF00" },
                            { name: "• Blue", value: "#0000FF" }
                        )
                )

                .addStringOption(option =>
                    option
                        .setName('image')
                        .setDescription("Embed image URL.")
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName('thumbnail')
                        .setDescription("Embed thumbnail URL.")
                        .setRequired(false)
                )

                .addStringOption(option =>
                    option
                        .setName('field-name')
                        .setDescription("First field name.")
                        .setRequired(false)
                        .setMaxLength(256)
                )

                .addStringOption(option =>
                    option
                        .setName('field-value')
                        .setDescription("First field value.")
                        .setRequired(false)
                        .setMaxLength(1024)
                )

                .addStringOption(option =>
                    option
                        .setName('second-field-name')
                        .setDescription("Second field name.")
                        .setRequired(false)
                        .setMaxLength(256)
                )

                .addStringOption(option =>
                    option
                        .setName('second-field-value')
                        .setDescription("Second field value.")
                        .setRequired(false)
                        .setMaxLength(1024)
                )

                .addStringOption(option =>
                    option
                        .setName('third-field-name')
                        .setDescription("Third field name.")
                        .setRequired(false)
                        .setMaxLength(256)
                )

                .addStringOption(option =>
                    option
                        .setName('third-field-value')
                        .setDescription("Third field value.")
                        .setRequired(false)
                        .setMaxLength(1024)
                )

                .addStringOption(option =>
                    option
                        .setName('forth-field-name')
                        .setDescription("Fourth field name.")
                        .setRequired(false)
                        .setMaxLength(256)
                )

                .addStringOption(option =>
                    option
                        .setName('forth-field-value')
                        .setDescription("Fourth field value.")
                        .setRequired(false)
                        .setMaxLength(1024)
                )

                .addStringOption(option =>
                    option
                        .setName('fifth-field-name')
                        .setDescription("Fifth field name.")
                        .setRequired(false)
                        .setMaxLength(256)
                )

                .addStringOption(option =>
                    option
                        .setName('fifth-field-value')
                        .setDescription("Fifth field value.")
                        .setRequired(false)
                        .setMaxLength(1024)
                )

                .addStringOption(option =>
                    option
                        .setName('sixth-field-name')
                        .setDescription("Sixth field name.")
                        .setRequired(false)
                        .setMaxLength(256)
                )

                .addStringOption(option =>
                    option
                        .setName('sixth-field-value')
                        .setDescription("Sixth field value.")
                        .setRequired(false)
                        .setMaxLength(1024)
                )

                .addStringOption(option =>
                    option
                        .setName('footer')
                        .setDescription("Embed footer.")
                        .setRequired(false)
                )
        )

        .addSubcommand(command =>
            command
                .setName('thread')
                .setDescription('Creates a temporary thread for you.')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription("Thread name.")
                        .setRequired(false)
                )
        ),

    async execute(interaction) {

        const sub = interaction.options.getSubcommand();

        switch (sub) {

            case 'embed': {

                const title = interaction.options.getString('title');

                const description = interaction.options
                    .getString('description')
                    .replace(/\\n/g, '\n');

                const color = interaction.options.getString('color');

                const image = interaction.options.getString('image');
                const thumbnail = interaction.options.getString('thumbnail');

                const footer = interaction.options.getString('footer') || ' ';

                const embed = new EmbedBuilder()
                    .setTitle(title)
                    .setDescription(description)
                    .setColor(color)
                    .setFooter({
                        text: footer,
                        iconURL: interaction.member.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp();

                if (image) {
                    if (!image.startsWith('http')) {
                        return interaction.reply({
                            content: 'You cannot use this image URL.',
                            flags: MessageFlags.Ephemeral
                        });
                    }

                    embed.setImage(image);
                }

                if (thumbnail) {
                    if (!thumbnail.startsWith('http')) {
                        return interaction.reply({
                            content: 'You cannot use this thumbnail URL.',
                            flags: MessageFlags.Ephemeral
                        });
                    }

                    embed.setThumbnail(thumbnail);
                }

                const fields = [
                    ['field-name', 'field-value'],
                    ['second-field-name', 'second-field-value'],
                    ['third-field-name', 'third-field-value'],
                    ['forth-field-name', 'forth-field-value'],
                    ['fifth-field-name', 'fifth-field-value'],
                    ['sixth-field-name', 'sixth-field-value']
                ];

                for (const [nameKey, valueKey] of fields) {
                    const name = interaction.options.getString(nameKey);
                    const value = interaction.options.getString(valueKey);

                    if (name) {
                        embed.addFields({
                            name,
                            value: value || ' '
                        });
                    }
                }

                await interaction.reply({
                    content: 'Your embed has been created!',
                    flags: MessageFlags.Ephemeral
                });

                await interaction.channel.send({
                    embeds: [embed]
                });

                break;
            }

            case 'thread': {

                if (
                    !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
                    timeout.includes(interaction.member.id)
                ) {
                    return interaction.reply({
                        content: 'You are on cooldown!',
                        flags: MessageFlags.Ephemeral
                    });
                }

                const threadtitle =
                    interaction.options.getString('name') || 'Unnamed Thread';

                await interaction.channel.threads.create({
                    name: threadtitle,
                    autoArchiveDuration: 60,
                    reason: 'Created a thread by an Admin.'
                });

                await interaction.reply({
                    content: `Created the "${threadtitle}" thread!`,
                    flags: MessageFlags.Ephemeral
                });

                timeout.push(interaction.user.id);

                setTimeout(() => {
                    const index = timeout.indexOf(interaction.user.id);

                    if (index > -1) {
                        timeout.splice(index, 1);
                    }
                }, 60000);

                break;
            }
        }
    }
};
