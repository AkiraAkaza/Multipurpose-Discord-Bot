const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  category: "Utility",
  name: "bank",
  description: "Donate cho bé Hoàng!",
  slashOnly: false,

  // Slash command data
  data: new SlashCommandBuilder()
    .setName("bank")
    .setDescription("Donate cho bé Hoàng!"),

  // Prefix command execution
  async executePrefix(message, args, client) {
    const bankImageURL = "https://cdn.discordapp.com/attachments/1415880474320044063/1455546217735127219/Screenshot_20251016_131123_MB_Bank.jpg"; // thay link ảnh

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("Donate cho bé Hoàng!")
      .setDescription(
        `💸 **STK:** 63080917202259\n` +
        `🏦 **Ngân hàng:** MBBank\n` +
        `👤 **Chủ TK:** Trịnh Vũ Hoàng\n` +
        `💖 Cảm ơn bạn đã ủng hộ!`
      )
      .setImage(bankImageURL);

    return message.reply({ embeds: [embed] });
  },

  // Slash command execution
  async executeSlash(interaction) {
    const bankImageURL = "https://cdn.discordapp.com/attachments/1415880474320044063/1455546217735127219/Screenshot_20251016_131123_MB_Bank.jpg"; // thay link ảnh

    const embed = new EmbedBuilder()
      .setColor("#00FF00")
      .setTitle("Donate cho bé Hoàng!")
      .setDescription(
        `💸 **STK:** 63080917202259\n` +
        `🏦 **Ngân hàng:** MBBank\n` +
        `👤 **Chủ TK:** Trịnh Vũ Hoàng\n` +
        `💖 Cảm ơn bạn đã ủng hộ!`
      )
      .setImage(bankImageURL);

    return interaction.reply({ embeds: [embed] });
  }
};