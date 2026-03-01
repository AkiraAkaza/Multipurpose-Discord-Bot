const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const API_URL = "https://api.mcsrvstat.us/2/160.25.233.228";
const DISPLAY_ADDRESS = "VietMC.xyz";

async function fetchServerData() {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  if (!data.online) throw new Error("Server Offline");

  return data;
}

function buildEmbed(data, requesterName) {

  const playersNow = data.players?.online ?? 0;
  const playersMax = data.players?.max ?? 0;
  const version = data.version ?? "Unknown";

  const percent = playersMax
    ? ((playersNow / playersMax) * 100).toFixed(1)
    : 0;

  const embed = new EmbedBuilder()
    .setColor(0x00ffcc)
    .setTitle("🟢 VIETMC COMMUNITY")
    .setDescription("**Máy chủ economy sword hàng đầu Việt Nam**")
    .addFields(
      {
        name: "🌍 Server Address",
        value: `\`${DISPLAY_ADDRESS}\``
      },
      {
        name: "👥 Players",
        value: `**${playersNow} / ${playersMax}**\ `
      },
      {
        name: "🛠 Version",
        value: version,
        inline: true
      },
    )
    .setFooter({
      text: `VietMC Community • Requested by ${requesterName}`
    })
    .setTimestamp();

  return embed;
}

function buildIconAttachment(data, embed) {
  let files = [];

  if (data.icon && data.icon.startsWith("data:image/png;base64,")) {
    const base64Data = data.icon.replace("data:image/png;base64,", "");
    const buffer = Buffer.from(base64Data, "base64");

    files.push({
      attachment: buffer,
      name: "icon.png"
    });

    embed.setThumbnail("attachment://icon.png");
  }

  return files;
}

module.exports = {
  category: 'Minecraft',
  name: 'ping',
  description: 'Check VietMC Minecraft server status',
  slashOnly: false,

  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check VietMC Minecraft server status'),

  // PREFIX COMMAND (.ping)
  async executePrefix(message, args, client) {

    try {
      const data = await fetchServerData();
      const embed = buildEmbed(data, message.author.username);
      const files = buildIconAttachment(data, embed);

      await message.reply({
        embeds: [embed],
        files: files
      });

    } catch (error) {

      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("🔴 VIETMC COMMUNITY")
        .setDescription("Server is currently offline or unreachable.")
        .addFields({
          name: "🌍 Server Address",
          value: `\`${DISPLAY_ADDRESS}\``
        })
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    }
  },

  // SLASH COMMAND (/ping)
  async executeSlash(interaction) {

    try {
      await interaction.deferReply();

      const data = await fetchServerData();
      const embed = buildEmbed(data, interaction.user.username);
      const files = buildIconAttachment(data, embed);

      await interaction.editReply({
        embeds: [embed],
        files: files
      });

    } catch (error) {

      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("🔴 VIETMC NETWORK")
        .setDescription("Server is currently offline or unreachable.")
        .addFields({
          name: "🌍 Server Address",
          value: `\`${DISPLAY_ADDRESS}\``
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  }
};
