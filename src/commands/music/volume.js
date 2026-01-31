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
  name: 'volume',
  description: 'Điều chỉnh âm lượng nhạc',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Điều chỉnh âm lượng nhạc')
    .addIntegerOption(option => 
      option.setName('level')
        .setDescription('Mức âm lượng (0-100)')
        .setMinValue(0)
        .setMaxValue(100)),

  async executePrefix(message, args, client) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để điều chỉnh âm lượng!', 
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
      // Nếu không có âm lượng, hiển thị âm lượng hiện tại
      if (!args[0]) {
        const currentVolume = player.volume || 100;
        const embed = {
          color: 0x1DB954,
          title: '🔊 Âm lượng Hiện tại',
          description: `Âm lượng hiện tại là **${currentVolume}%**`,
          fields: [
            { name: '🎵 Đang phát', value: player.current ? player.current.info.title : 'Không có gì', inline: true }
          ],
          timestamp: new Date().toISOString()
        };
        return message.reply({ embeds: [embed] });
      }

      const volume = parseInt(args[0]);
      
      if (isNaN(volume) || volume < 0 || volume > 100) {
        return message.reply({ 
          content: '❌ Vui lòng cung cấp mức âm lượng từ 0 đến 100!', 
          flags: [64]
        });
      }

      player.setVolume(volume);
      
      const embed = {
        color: 0x1DB954,
        title: '🔊 Âm lượng đã điều chỉnh',
        description: `Âm lượng đã được đặt thành **${volume}%**`,
        fields: [
          { name: '📊 Âm lượng Hiện tại', value: `${volume}%`, inline: true },
          { name: '🎵 Đang phát', value: player.current ? `${player.current.info.title} (${formatDuration(player.current.info.length)})` : 'Không có gì', inline: true }
        ],
        timestamp: new Date().toISOString()
      };

      await message.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi âm lượng:', error);
      await message.reply({ content: '❌ Đã xảy ra lỗi khi điều chỉnh âm lượng!', flags: [64] });
    }
  },

  async executeSlash(interaction, client) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để điều chỉnh âm lượng!', 
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
      const volume = interaction.options.getInteger('level');
      
      // Nếu không có âm lượng, hiển thị âm lượng hiện tại
      if (volume === null) {
        const currentVolume = player.volume || 100;
        const embed = {
          color: 0x1DB954,
          title: '🔊 Âm lượng Hiện tại',
          description: `Âm lượng hiện tại là **${currentVolume}%**`,
          fields: [
            { name: '🎵 Đang phát', value: player.current ? player.current.info.title : 'Không có gì', inline: true }
          ],
          timestamp: new Date().toISOString()
        };
        return interaction.reply({ embeds: [embed] });
      }
      
      if (volume < 0 || volume > 100) {
        return interaction.reply({ 
          content: '❌ Âm lượng phải từ 0 đến 100!', 
          flags: [64]
        });
      }

      player.setVolume(volume);
      
      const embed = {
        color: 0x1DB954,
        title: '🔊 Âm lượng đã điều chỉnh',
        description: `Âm lượng đã được đặt thành **${volume}%**`,
        fields: [
          { name: '📊 Âm lượng Hiện tại', value: `${volume}%`, inline: true },
          { name: '🎵 Đang phát', value: player.current ? `${player.current.info.title} (${formatDuration(player.current.info.length)})` : 'Không có gì', inline: true }
        ],
        timestamp: new Date().toISOString()
      };

      await interaction.reply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Lỗi âm lượng:', error);
      await interaction.reply({ content: '❌ Đã xảy ra lỗi khi điều chỉnh âm lượng!', flags: [64] });
    }
  }
};