const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Âm nhạc',
  name: 'stop',
  description: 'Dừng nhạc và xóa hàng chờ',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Dừng nhạc và xóa hàng chờ'),

  async executePrefix(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để dừng nhạc!', 
        flags: [64]
      });
    }

    const player = client.riffy?.players.get(message.guild.id);
    if (!player) {
      return message.reply({ 
        content: '❌ Không có nhạc nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      player.destroy();
      
      const embed = {
        color: 0xFF4444,
        title: '⏹️ Nhạc đã dừng',
        description: 'Nhạc đã dừng và hàng chờ đã được xóa!',
        timestamp: new Date().toISOString()
      };

      await message.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi dừng:', error);
      await message.reply({ content: '❌ Đã xảy ra lỗi khi dừng nhạc!', flags: [64] });
    }
  },

  async executeSlash(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để dừng nhạc!', 
        flags: [64]
      });
    }

    const player = client.riffy?.players.get(interaction.guild.id);
    if (!player) {
      return interaction.reply({ 
        content: '❌ Không có nhạc nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      player.destroy();
      
      const embed = {
        color: 0xFF4444,
        title: '⏹️ Nhạc đã dừng',
        description: 'Nhạc đã dừng và hàng chờ đã được xóa!',
        timestamp: new Date().toISOString()
      };

      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi dừng:', error);
      await interaction.reply({ content: '❌ Đã xảy ra lỗi khi dừng nhạc!', flags: [64] });
    }
  }
};