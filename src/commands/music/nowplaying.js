const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Âm nhạc',
  name: 'nowplaying',
  description: 'Hiển thị thông tin bài hát đang phát',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Hiển thị thông tin bài hát đang phát'),

  async executePrefix(message, args, client) {
    const player = client.riffy?.players.get(message.guild.id);
    
    if (!player || !player.current) {
      return message.reply({ 
        content: '❌ Không có bài hát nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      const track = player.current;
      const progressBar = createProgressBar(player.position, track.info.length, 20);
      
      const embed = {
        color: 0x1DB954,
        title: '🎵 Đang phát',
        description: `**${track.info.title}**`,
        thumbnail: { url: track.info.thumbnail },
        fields: [
          { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
          { name: '⏱️ Thời lượng', value: formatDuration(track.info.length), inline: true },
          { name: '🔂 Lặp lại', value: player.loop === 'none' ? 'Tắt' : player.loop, inline: true },
          { name: '📊 Tiến độ', value: `\`${progressBar}\``, inline: false }
        ],
        footer: { text: `👤 Được yêu cầu bởi: ${track.info.requester.username}` },
        timestamp: new Date().toISOString()
      };

      await message.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi đang phát:', error);
      await message.reply({ content: '❌ Đã xảy ra lỗi khi lấy thông tin bài hát đang phát!', flags: [64] });
    }
  },

  async executeSlash(interaction, client) {
    const player = client.riffy?.players.get(interaction.guild.id);
    
    if (!player || !player.current) {
      return interaction.reply({ 
        content: '❌ Không có bài hát nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      const track = player.current;
      const progressBar = createProgressBar(player.position, track.info.length, 20);
      
      const embed = {
        color: 0x1DB954,
        title: '🎵 Đang phát',
        description: `**${track.info.title}**`,
        thumbnail: { url: track.info.thumbnail },
        fields: [
          { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
          { name: '⏱️ Thời lượng', value: formatDuration(track.info.length), inline: true },
          { name: '🔂 Lặp lại', value: player.loop === 'none' ? 'Tắt' : player.loop, inline: true },
          { name: '📊 Tiến độ', value: `\`${progressBar}\``, inline: false }
        ],
        footer: { text: `👤 Được yêu cầu bởi: ${track.info.requester.username}` },
        timestamp: new Date().toISOString()
      };

      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi đang phát:', error);
      await interaction.reply({ content: '❌ Đã xảy ra lỗi khi lấy thông tin bài hát đang phát!', flags: [64] });
    }
  }
};

function createProgressBar(position, duration, size) {
  const percentage = position / duration;
  const progress = Math.round(size * percentage);
  const emptyProgress = size - progress;
  
  const progressString = '█'.repeat(progress);
  const emptyString = '░'.repeat(emptyProgress);
  
  const percentageText = `${Math.round(percentage * 100)}%`;
  
  return `${progressString}${emptyString} ${percentageText}`;
}

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