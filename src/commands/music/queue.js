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
  name: 'queue',
  description: 'Hiển thị hàng chờ nhạc hiện tại',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Hiển thị hàng chờ nhạc hiện tại')
    .addIntegerOption(option => 
      option.setName('page')
        .setDescription('Số trang của hàng chờ')
        .setMinValue(1)
        .setMaxValue(10)),

  async executePrefix(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để xem hàng chờ!', 
        flags: [64]
      });
    }

    const player = client.riffy?.players.get(message.guild.id);
    if (!player || (!player.current && player.queue.size === 0)) {
      return message.reply({ 
        content: '❌ Hàng chờ trống! Thêm một số bài hát bằng `!play`', 
        flags: [64]
      });
    }

    try {
      const page = parseInt(args[0]) || 1;
      const pageSize = 10;
      const totalPages = Math.ceil(player.queue.size / pageSize);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const queue = player.queue.slice(start, end);

      const currentTrack = player.current;

      const embed = {
        color: 0x1DB954,
        title: '🎵 Hàng chờ Nhạc',
        description: `📊 Tổng bài hát: **${player.queue.size}**`,
        fields: [],
        thumbnail: currentTrack ? { url: currentTrack.info.thumbnail } : null,
        timestamp: new Date().toISOString()
      };

      // Thêm hiện đang phát nếu tồn tại
      if (currentTrack) {
        embed.fields.push({
          name: '🎵 Đang phát',
          value: `**${currentTrack.info.title}**\n👤 ${currentTrack.info.author}\n⏱️ ${formatDuration(currentTrack.info.length)}\n👤 Được yêu cầu bởi: ${currentTrack.info.requester.username}`,
          inline: false
        });
      }

      // Thêm các mục hàng chờ
      if (queue.length > 0) {
        const queueList = queue.map((track, index) => 
          `**${start + index + 1}.** ${track.info.title} - ${track.info.author}`
        ).join('\n');

        embed.fields.push({
          name: `📋 Hàng chờ (Trang ${page}/${totalPages})`,
          value: queueList || 'Không có thêm bài hát trong hàng chờ',
          inline: false
        });
      }

      embed.footer = { 
        text: totalPages > 1 ? `Trang ${page} của ${totalPages}` : 'Hàng chờ' 
      };

      await message.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi hàng chờ:', error);
      await message.reply({ content: '❌ Đã xảy ra lỗi khi lấy hàng chờ!', flags: [64] });
    }
  },

  async executeSlash(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để xem hàng chờ!', 
        flags: [64]
      });
    }

    const player = client.riffy?.players.get(interaction.guild.id);
    if (!player || (!player.current && player.queue.size === 0)) {
      return interaction.reply({ 
        content: '❌ Hàng chờ trống! Thêm một số bài hát bằng `/play`', 
        flags: [64]
      });
    }

    try {
      const page = interaction.options.getInteger('page') || 1;
      const pageSize = 10;
      const totalPages = Math.ceil(player.queue.size / pageSize);
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const queue = player.queue.slice(start, end);

      const currentTrack = player.current;

      const embed = {
        color: 0x1DB954,
        title: '🎵 Hàng chờ Nhạc',
        description: `📊 Tổng bài hát: **${player.queue.size}**`,
        fields: [],
        thumbnail: currentTrack ? { url: currentTrack.info.thumbnail } : null,
        timestamp: new Date().toISOString()
      };

      // Thêm hiện đang phát nếu tồn tại
      if (currentTrack) {
        embed.fields.push({
          name: '🎵 Đang phát',
          value: `**${currentTrack.info.title}**\n👤 ${currentTrack.info.author}\n⏱️ ${formatDuration(currentTrack.info.length)}\n👤 Được yêu cầu bởi: ${currentTrack.info.requester.username}`,
          inline: false
        });
      }

      // Thêm các mục hàng chờ
      if (queue.length > 0) {
        const queueList = queue.map((track, index) => 
          `**${start + index + 1}.** ${track.info.title} - ${track.info.author}`
        ).join('\n');

        embed.fields.push({
          name: `📋 Hàng chờ (Trang ${page}/${totalPages})`,
          value: queueList || 'Không có thêm bài hát trong hàng chờ',
          inline: false
        });
      }

      embed.footer = { 
        text: totalPages > 1 ? `Trang ${page} của ${totalPages}` : 'Hàng chờ' 
      };

      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi hàng chờ:', error);
      await interaction.reply({ content: '❌ Đã xảy ra lỗi khi lấy hàng chờ!', flags: [64] });
    }
  }
};