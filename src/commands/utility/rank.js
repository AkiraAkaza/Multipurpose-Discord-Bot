const { SlashCommandBuilder } = require("discord.js");

const replyRank =
`# Bảng giá rank VietMC
Rank Viet     20,000 VNĐ
Rank Viet+    50,000 VNĐ
Rank Viet++   100,000 VNĐ
Rank VietX    200,000 VNĐ
Rank VietX+   400,000 VNĐ
Rank Custom   600,000 VNĐ`;

module.exports = {
  category: "Utility",
  name: "rank",
  description: "Bảng giá rank VietMC",
  slashOnly: false,

  // Slash command data
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Xem bảng giá rank VietMC"),

  // Prefix command execution
  async executePrefix(message, args, client) {
    return message.reply(replyRank);
  },

  // Slash command execution
  async executeSlash(interaction) {
    return interaction.reply(replyRank);
  }
};
