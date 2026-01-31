const { SlashCommandBuilder } = require("discord.js");

const replyIP = `IP: Vietmc.xyz
Port: 25565
Pe port: 19132

IP phụ:
mc.vietmc.xyz
vietmc.xyz:25565
138.252.132.142:25565

Support pe và pc
Version: 1.20x -> 1.21x`;

let listenerRegistered = false;

module.exports = {
  category: "Utility",
  name: "ip",
  description: "Thông tin ip máy chủ Minecraft",
  slashOnly: false,

  // Slash command data
  data: new SlashCommandBuilder()
    .setName("ip")
    .setDescription("Thông tin ip máy chủ Minecraft"),

  // Prefix command execution
  async executePrefix(message, args, client) {
    if (!listenerRegistered) {
      listenerRegistered = true;

      client.on("messageCreate", (msg) => {
        if (msg.author.bot) return;

        const content = message.content.toLowerCase().trim();

        const regexIp = /(^|\s)ip(\s|$)/i;
        if (regexIp.test(content)) {
          return message.reply(replyIP);
        }
      });
    }

    return message.reply(replyIP);
  },

  // Slash command execution
  async executeSlash(interaction) {
    return interaction.reply(replyIP);
  }
};