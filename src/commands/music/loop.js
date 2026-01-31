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
  name: 'loop',
  description: 'Bật/tắt chế độ lặp nhạc',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Bật/tắt chế độ lặp nhạc')
    .addStringOption(option => 
      option.setName('mode')
        .setDescription('Chế độ lặp hoặc "bật/tắt"')
        .addChoices(
          { name: '🔁 Bật/Tắt Lặp', value: 'toggle' },
          { name: '🔂 Lặp Hàng chờ', value: 'queue' },
          { name: '🔁 Lặp Bài hát', value: 'song' },
          { name: '⏹ Tắt Lặp', value: 'off' }
        )),

  async executePrefix(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để sử dụng lặp!', 
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
      const mode = args[0]?.toLowerCase() || 'toggle';
      let newMode;
      let description;

      switch (mode) {
        case 'toggle':
          newMode = player.loop === 'none' ? 'queue' : 'none';
          description = player.loop === 'none' ? '🔂 Lặp hàng chờ đã bật' : '⏹ Lặp đã tắt';
          break;
        case 'queue':
          newMode = 'queue';
          description = '🔂 Lặp hàng chờ đã bật';
          break;
        case 'song':
          newMode = 'song';
          description = '🔁 Lặp bài hát đã bật';
          break;
        case 'off':
          newMode = 'none';
          description = '⏹ Lặp đã tắt';
          break;
        default:
          return message.reply({ 
            content: '❌ Chế độ không hợp lệ! Sử dụng: toggle, queue, song, hoặc off', 
            flags: [64]
          });
      }

      player.setLoop(newMode);
      
      const embed = {
        color: 0x1DB954,
        title: '🔁 Chế độ Lặp Đã Thay đổi',
        description: description,
        fields: [
          { name: '📊 Chế độ Hiện tại', value: newMode === 'none' ? 'Tắt' : newMode, inline: true },
          { name: '🎵 Đang phát', value: `${player.current.info.title} (${formatDuration(player.current.info.length)})`, inline: true }
        ],
        timestamp: new Date().toISOString()
      };

      await message.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi lặp:', error);
      await message.reply({ content: '❌ Đã xảy ra lỗi khi thay đổi chế độ lặp!', flags: [64] });
    }
  },

  async executeSlash(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để sử dụng lặp!', 
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
      const mode = interaction.options.getString('mode') || 'toggle';
      let newMode;
      let description;

      switch (mode) {
        case 'toggle':
          newMode = player.loop === 'none' ? 'queue' : 'none';
          description = player.loop === 'none' ? '🔂 Lặp hàng chờ đã bật' : '⏹ Lặp đã tắt';
          break;
        case 'queue':
          newMode = 'queue';
          description = '🔂 Lặp hàng chờ đã bật';
          break;
        case 'song':
          newMode = 'song';
          description = '🔁 Lặp bài hát đã bật';
          break;
        case 'off':
          newMode = 'none';
          description = '⏹ Lặp đã tắt';
          break;
      }

      player.setLoop(newMode);
      
      const embed = {
        color: 0x1DB954,
        title: '🔁 Chế độ Lặp Đã Thay đổi',
        description: description,
        fields: [
          { name: '📊 Chế độ Hiện tại', value: newMode === 'none' ? 'Tắt' : newMode, inline: true },
          { name: '🎵 Đang phát', value: `${player.current.info.title} (${formatDuration(player.current.info.length)})`, inline: true }
        ],
        timestamp: new Date().toISOString()
      };

      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi lặp:', error);
      await interaction.reply({ content: '❌ Đã xảy ra lỗi khi thay đổi chế độ lặp!', flags: [64] });
    }
  }
};