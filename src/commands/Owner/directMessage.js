const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    MessageFlags
} = require("discord.js");

// Users allowed to use this command
const OWNER_IDS = [
    "1340732093004648680", // Replace with first ID
    "961048718612774922", // Replace with second ID
    "1106309950457778207"  // Replace with third ID
];

module.exports = {
    usableInDms: false,
    category: "Owner",
    permissions: [PermissionFlagsBits.Administrator],

    data: new SlashCommandBuilder()
        .setName("direct-message")
        .setDescription("Messages a user, only available for the owner of the bot.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("Specified message will be sent to specified user.")
                .setRequired(true)
        )
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Specified user will be sent the specified message.")
                .setRequired(true)
        ),

    async execute(interaction, client) {

        const user = interaction.options.getUser("user");
        const message = interaction.options.getString("message");

        // Only allow the 3 owners
        if (!OWNER_IDS.includes(interaction.user.id)) {
            return interaction.reply({
                content: client.config.ownerOnlyCommand,
                flags: MessageFlags.Ephemeral
            });
        }

        user.send({
            content: `${message}`
        }).catch(() => {
            return;
        });

        const embed = new EmbedBuilder()
            .setAuthor({ name: `DM Command ${client.config.devBy}` })
            .setTitle(`${client.user.username} DM Tool ${client.config.arrowEmoji}`)
            .setColor(client.config.embedDev)
            .setDescription(`> Your message has been sent to **${user}**`)
            .setFooter({ text: `Message sent!` })
            .setThumbnail(client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            flags: MessageFlags.Ephemeral
        });
    }
};
