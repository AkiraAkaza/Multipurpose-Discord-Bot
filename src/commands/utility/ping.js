const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Tiện ích',
  name: 'ping',
  description: 'Kiểm tra độ trễ của bot',
  
  // Dữ liệu lệnh dấu gạch chéo
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ của bot'),

  // Thực thi lệnh tiền tố
  async executePrefix(message, args, client) {
    const sent = await message.reply('Đang ping...');
    const timeDiff = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(`Pong! Độ trễ: ${timeDiff}ms`);
  },

  // Thực thi lệnh dấu gạch chéo
  async executeSlash(interaction) {
    const sent = await interaction.reply({ content: 'Đang ping...', fetchReply: true });
    const timeDiff = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! Độ trễ: ${timeDiff}ms`);
  }
};