const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { getServerData } = require("../../utils/erlc");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("erlc_info")
        .setDescription("View ERLC server information"),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            const server = await getServerData(
                interaction.guild.id
            );

            if (!server) {

                return interaction.editReply({
                    content:
                        "❌ ERLC has not been configured for this server.\nUse `/erlc config` first."
                });

            }

            const embed = new EmbedBuilder()

                .setTitle("ERLC Server Information")

                .addFields(
                    {
                        name: "Server Name",
                        value: server.name || "Unknown",
                        inline: true
                    },
                    {
                        name: "Server Code",
                        value: `\`${server.code || "Unknown"}\``,
                        inline: true
                    },
                    {
                        name: "Owner",
                        value: server.owner || "Unknown",
                        inline: true
                    },
                    {
                        name: "Players",
                        value: `${server.players}/${server.maxPlayers}`,
                        inline: true
                    },
                    {
                        name: "Queue",
                        value: `${server.queue}`,
                        inline: true
                    }
                )

                .setFooter({
                    text: "StarLine ERLC Integration"
                })

                .setTimestamp();

            const row = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setLabel("Quick Join")

                        .setStyle(ButtonStyle.Link)

                        .setURL(
                            server.joinUrl ||
                            `https://erlc.gg/join/${server.code}`
                        )

                );

            await interaction.editReply({

                embeds: [embed],

                components: [row]

            });

        } catch (err) {

            console.error(err);

            await interaction.editReply({

                content:
                    "❌ Failed to fetch ERLC server information."

            });

        }

    }

};
