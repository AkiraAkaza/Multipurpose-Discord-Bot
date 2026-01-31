const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Giải trí',
  name: 'roll',
  description: 'Tung một con xúc xắc với số mặt được chỉ định',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Tung một con xúc xắc với số mặt được chỉ định')
    .addIntegerOption(option => 
      option.setName('sides')
        .setDescription('Số mặt của xúc xắc')
        .setRequired(false)
        .setMinValue(2)
        .setMaxValue(1000)),

  async executePrefix(message, args, client) {
    const sides = parseInt(args[0]) || 6;
    
    if (sides < 2 || sides > 1000) {
      return message.reply({ content: 'Vui lòng chọn một số từ 2 đến 1000!', flags: [64] });
    }

    const roll = Math.floor(Math.random() * sides) + 1;

    const embed = {
      color: 0x2ECC71,
      title: '🎲 Tung Xúc Xắc',
      description: `Bạn đã tung một xúc xắc **${sides}** mặt và nhận được: **${roll}**`,
      timestamp: new Date().toISOString()
    };

    await message.reply({ embeds: [embed] });
  },

  async executeSlash(interaction) {
    const sides = interaction.options.getInteger('sides') || 6;

    const roll = Math.floor(Math.random() * sides) + 1;

    const embed = {
      color: 0x2ECC71,
      title: '🎲 Tung Xúc Xắc',
      description: `Bạn đã tung một xúc xắc **${sides}** mặt và nhận được: **${roll}**`,
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};