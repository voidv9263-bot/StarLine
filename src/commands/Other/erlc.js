const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const ErlcConfig = require("../../schemas/ErlcConfig");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("erlc")
        .setDescription("Manage ERLC settings")

        .addSubcommand(sub =>
            sub
                .setName("config")
                .setDescription("Configure the ERLC API")
                .addStringOption(option =>
                    option
                        .setName("api_key")
                        .setDescription("Your ERLC API Key")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("server_key")
                        .setDescription("Your ERLC Server Key")
                        .setRequired(true)
                )
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const subcommand =
            interaction.options.getSubcommand();

        if (subcommand === "config") {

            const apiKey =
                interaction.options.getString("api_key");

            const serverKey =
                interaction.options.getString("server_key");

            try {

                await ErlcConfig.findOneAndUpdate(
                    {
                        guildId: interaction.guild.id
                    },
                    {
                        guildId: interaction.guild.id,
                        apiKey: apiKey,
                        serverKey: serverKey
                    },
                    {
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true
                    }
                );

                return interaction.reply({
                    content:
                        "ERLC configuration has been saved successfully.",
                    ephemeral: true
                });

            } catch (err) {

                console.error(err);

                return interaction.reply({
                    content:
                        "❌ Failed to save the ERLC configuration.",
                    ephemeral: true
                });

            }
        }
    }
};
