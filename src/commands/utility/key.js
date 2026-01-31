const { SlashCommandBuilder } = require("discord.js");

const replyKey = `# Bảng giá key VietMC
Gold key:   5,000 VNĐ
Mythic key: 10,000 VNĐ
Amethyst:   15,000 VNĐ
Crimson:    20,000 VNĐ`;

module.exports = {
  category: "Utility",
  name: "key",
  description: "Bảng giá key VietMC",
  slashOnly: false,

  // Slash command data
  data: new SlashCommandBuilder()
    .setName("key")
    .setDescription("Bảng giá key VietMC"),

  // Prefix command execution
  async executePrefix(message, args, client) {
    return message.reply(replyKey);
  },

  // Slash command execution
  async executeSlash(interaction) {
    return interaction.reply(replyKey);
  }
};
