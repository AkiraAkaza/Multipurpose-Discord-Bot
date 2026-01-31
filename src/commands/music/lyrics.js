const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Âm nhạc',
  name: 'lyrics',
  description: 'Lấy lời bài hát hiện đang phát',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Lấy lời bài hát hiện đang phát'),

  async executePrefix(message, args, client) {
    const player = client.riffy?.players.get(message.guild.id);
    
    if (!player || !player.queue.current) {
      return message.reply({ 
        content: '❌ Không có bài hát nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      const track = player.queue.current;
      const query = `${track.info.author} ${track.info.title}`;
      
      // Sử dụng tìm kiếm lời bài hát đơn giản (trong sản xuất, bạn sẽ sử dụng API lời bài hát thích hợp)
      const lyrics = await searchLyrics(query);
      
      if (!lyrics) {
        return message.reply({ 
          content: `❌ Không thể tìm thấy lời bài hát cho **${track.info.title}** của **${track.info.author}**!`, 
          flags: [64]
        });
      }

      // Chia lời bài hát nếu quá dài
      const maxChars = 2000;
      const lyricsChunks = [];
      for (let i = 0; i < lyrics.length; i += maxChars) {
        lyricsChunks.push(lyrics.substring(i, i + maxChars));
      }

      const embed = {
        color: 0x1DB954,
        title: `🎵 Lời bài hát - ${track.info.title}`,
        description: lyricsChunks[0],
        fields: [
          { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
          { name: '🎵 Bài hát', value: track.info.title, inline: true }
        ],
        footer: { text: '⚠️ Lời bài hát chỉ dùng cho mục đích giáo dục' },
        timestamp: new Date().toISOString()
      };

      const replyMessage = await message.reply({ embeds: [embed] });
      
      // Gửi các phần bổ sung nếu cần
      for (let i = 1; i < lyricsChunks.length; i++) {
        await replyMessage.channel.send(`\`${lyricsChunks[i]}\``);
      }
      
    } catch (error) {
      console.error('Lỗi lời bài hát:', error);
      await message.reply({ content: '❌ Đã xảy ra lỗi khi lấy lời bài hát!', flags: [64] });
    }
  },

  async executeSlash(interaction, client) {
    const player = client.riffy?.players.get(interaction.guild.id);
    
    if (!player || !player.queue.current) {
      return interaction.reply({ 
        content: '❌ Không có bài hát nào đang phát lúc này!', 
        flags: [64]
      });
    }

    try {
      const track = player.queue.current;
      const query = `${track.info.author} ${track.info.title}`;
      
      const lyrics = await searchLyrics(query);
      
      if (!lyrics) {
        return interaction.reply({ 
          content: `❌ Không thể tìm thấy lời bài hát cho **${track.info.title}** của **${track.info.author}**!`, 
          flags: [64]
        });
      }

      // Chia lời bài hát nếu quá dài
      const maxChars = 2000;
      const lyricsChunks = [];
      for (let i = 0; i < lyrics.length; i += maxChars) {
        lyricsChunks.push(lyrics.substring(i, i + maxChars));
      }

      const embed = {
        color: 0x1DB954,
        title: `🎵 Lời bài hát - ${track.info.title}`,
        description: lyricsChunks[0],
        fields: [
          { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
          { name: '🎵 Bài hát', value: track.info.title, inline: true }
        ],
        footer: { text: '⚠️ Lời bài hát chỉ dùng cho mục đích giáo dục' },
        timestamp: new Date().toISOString()
      };

      const replyMessage = await interaction.reply({ embeds: [embed] });
      
      // Gửi các phần bổ sung nếu cần
      for (let i = 1; i < lyricsChunks.length; i++) {
        await replyMessage.channel.send(`\`${lyricsChunks[i]}\``);
      }
      
    } catch (error) {
      console.error('Lỗi lời bài hát:', error);
      await interaction.reply({ content: '❌ Đã xảy ra lỗi khi lấy lời bài hát!', flags: [64] });
    }
  }
};

async function searchLyrics(query) {
  // Tìm kiếm lời bài hát giả đơn giản (trong sản xuất, sử dụng API lời bài hát thực)
  const lyrics = {
    'Never Gonna Give You Up': 'Never gonna give you up\nNever gonna let you down\nNever gonna run around and desert you\nNever gonna make you cry, never gonna say goodbye',
    'Bohemian Rhapsody': 'Is this the real life?\nIs this just fantasy?\nCaught in a landslide\nNo escape from reality',
    'Sweet Child O Mine': 'Sweet child o\' mine\nSweet love of mine\nHe\'s got eyes of the bluest skies',
    default: `🎶 ${query} 🎶\n\n[ Lời bài hát sẽ được hiển thị ở đây ]\n\n🎵 Lời bài hát đầy đủ không có sẵn`
  };

  // Lôgic khớp đơn giản
  for (const [song, lyrics] of Object.entries(lyrics)) {
    if (query.toLowerCase().includes(song.toLowerCase())) {
      return lyrics;
    }
  }

  return lyrics.default;
}