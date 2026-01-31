const { SlashCommandBuilder } = require('discord.js');

function formatDuration(milliseconds) {
  if (!milliseconds || milliseconds <= 0) return '00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

module.exports = {
  category: 'Âm nhạc',
  name: 'skip',
  description: 'Bỏ qua bài hát hiện tại',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Bỏ qua bài hát hiện tại')
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Số bài hát cần bỏ qua (mặc định: 1)')
        .setMinValue(1)
        .setMaxValue(10)),

  async executePrefix(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để bỏ qua bài hát!', 
        flags: [64]
      });
    }

    const player = client.riffy?.players.get(message.guild.id);
    if (!player || !player.current) {
      return message.reply({ 
        content: '❌ Không có bài hát nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      const skipAmount = parseInt(args[0]) || 1;
      let skipped = 0;

      for (let i = 0; i < skipAmount; i++) {
        if (player.queue.size > 0) {
          player.stop();
          skipped++;
        } else {
          break;
        }
      }

      const embed = {
        color: 0x1DB954,
        title: '⏭️ Bài hát đã bỏ qua!',
        description: `Đã bỏ qua thành công **${skipped}** bài hát${skipped !== 1 ? '' : ''}!`,
        fields: [
          { name: '📊 Kích thước Hàng chờ', value: `${player.queue.size}`, inline: true },
          { name: '🎵 Đang phát', value: player.current ? `${player.current.info.title} (${formatDuration(player.current.info.length)})` : 'Không có gì', inline: true }
        ],
        timestamp: new Date().toISOString()
      };

      await message.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi bỏ qua:', error);
      await message.reply({ content: '❌ Đã xảy ra lỗi khi bỏ qua bài hát!', flags: [64] });
    }
  },

  async executeSlash(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để bỏ qua bài hát!', 
        flags: [64]
      });
    }

    const player = client.riffy?.players.get(interaction.guild.id);
    if (!player || !player.current) {
      return interaction.reply({ 
        content: '❌ Không có bài hát nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      const skipAmount = interaction.options.getInteger('amount') || 1;
      let skipped = 0;

      for (let i = 0; i < skipAmount; i++) {
        if (player.queue.size > 0) {
          player.stop();
          skipped++;
        } else {
          break;
        }
      }

      const embed = {
        color: 0x1DB954,
        title: '⏭️ Bài hát đã bỏ qua!',
        description: `Đã bỏ qua thành công **${skipped}** bài hát${skipped !== 1 ? '' : ''}!`,
        fields: [
          { name: '📊 Kích thước Hàng chờ', value: `${player.queue.size}`, inline: true },
          { name: '🎵 Đang phát', value: player.current ? `${player.current.info.title} (${formatDuration(player.current.info.length)})` : 'Không có gì', inline: true }
        ],
        timestamp: new Date().toISOString()
      };

      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi bỏ qua:', error);
      await interaction.reply({ content: '❌ Đã xảy ra lỗi khi bỏ qua bài hát!', flags: [64] });
    }
  }
};