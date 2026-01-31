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
  name: 'play',
  description: 'Phát bài hát hoặc thêm vào hàng chờ',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Phát bài hát hoặc thêm vào hàng chờ')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Tên bài hát hoặc URL để phát')
        .setRequired(true)),

  async executePrefix(message, args, client) {
    if (!args[0]) {
      return message.reply({ 
        content: 'Cách sử dụng: `!play <tên bài hát hoặc URL>`', 
        flags: [64]
      });
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để phát nhạc!', 
        flags: [64]
      });
    }

    const permissions = voiceChannel.permissionsFor(message.guild.members.me);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.reply({ 
        content: '❌ Tôi cần quyền kết nối và nói chuyện trong kênh thoại của bạn!', 
        flags: [64]
      });
    }

    try {
      const query = args.join(' ');
      const player = client.riffy?.players.get(message.guild.id);
      
      if (player && player.state !== 'DISCONNECTED') {
        const resolve = await client.riffy.resolve({
          query: query,
          requester: message.author,
        });

        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === 'playlist') {
          for (const track of tracks) {
            track.info.requester = message.author;
            player.queue.add(track);
          }
          
          const embed = {
            color: 0x1DB954,
            title: '📋 Danh sách phát đã thêm',
            description: `Đã thêm **${tracks.length}** bài hát từ danh sách phát: **${playlistInfo.name}**`,
            thumbnail: { url: playlistInfo.thumbnail },
            timestamp: new Date().toISOString()
          };
          
          await message.reply({ embeds: [embed] });
          if (!player.playing && !player.paused) return player.play();
        } else if (loadType === 'search' || loadType === 'track') {
          const track = tracks.shift();
          track.info.requester = message.author;
          player.queue.add(track);
          
          const embed = {
            color: 0x1DB954,
            title: '🎵 Bài hát đã thêm',
            description: `Đã thêm **${track.info.title}** vào hàng chờ`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
              { name: '⏱️ Thời lượng', value: formatDuration(track.info.length), inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await message.reply({ embeds: [embed] });
          if (!player.playing && !player.paused) return player.play();
        } else {
          await message.reply({ 
            content: '❌ Không tìm thấy kết quả cho truy vấn của bạn!', 
            flags: [64]
          });
        }
      } else {
        const query = args.join(' ');
        const resolve = await client.riffy.resolve({
          query: query,
          requester: message.author,
        });

        const { loadType, tracks } = resolve;

        if (loadType === 'search' || loadType === 'track') {
          const track = tracks[0];
          if (!track) {
            return message.reply({ 
              content: '❌ Không tìm thấy kết quả cho truy vấn của bạn!', 
              flags: [64]
            });
          }

          const newPlayer = await client.riffy.createConnection({
            guildId: message.guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: message.channel.id,
            deaf: true,
          });

          track.info.requester = message.author;
          
          // Đợi trình phát sẵn sàng trước khi phát
          const waitForPlayer = () => {
            return new Promise((resolve, reject) => {
              const checkPlayer = () => {
                if (newPlayer.connected) {
                  resolve();
                } else {
                  setTimeout(checkPlayer, 100);
                }
              };
              checkPlayer();
            });
          };
          
          try {
            await waitForPlayer();
            console.log('Trình phát đã kết nối (tiền tố), thêm vào hàng chờ');
            newPlayer.queue.add(track);
            console.log('Bài hát đã thêm vào hàng chờ, kích thước:', newPlayer.queue.size);
            
            // Thử gọi phát với độ trễ
            setTimeout(() => {
              console.log('Cố gắng phát bị trễ (tiền tố):', {
                queueSize: newPlayer.queue.size,
                playing: newPlayer.playing,
                paused: newPlayer.paused
              });
              try {
                newPlayer.play();
              } catch (playError) {
                console.error('Lỗi phát bị trễ (tiền tố):', playError);
              }
            }, 500);
          } catch (error) {
            console.error('Lỗi kết nối trình phát (tiền tố):', error);
          }
          
          const embed = {
            color: 0x1DB954,
            title: '🎵 Đang phát',
            description: `**${track.info.title}**`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
              { name: '⏱️ Thời lượng', value: formatDuration(track.info.length), inline: true },
              { name: '👤 Người yêu cầu', value: message.author.username, inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await message.reply({ embeds: [embed] });
        } else {
          await message.reply({ 
            content: '❌ Không tìm thấy kết quả cho truy vấn của bạn!', 
            flags: [64]
          });
        }
      }
      
    } catch (error) {
      console.error('Lỗi lệnh phát:', error);
      await message.reply({ 
        content: '❌ Đã xảy ra lỗi khi cố gắng phát bài hát!', 
        flags: [64]
      });
    }
  },

  async executeSlash(interaction, client) {
    const query = interaction.options.getString('query');
    
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ 
        content: '❌ Bạn cần phải ở trong một kênh thoại để phát nhạc!', 
        flags: [64]
      });
    }

    const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return interaction.reply({ 
        content: '❌ Tôi cần quyền kết nối và nói chuyện trong kênh thoại của bạn!', 
        flags: [64]
      });
    }

    try {
      const player = client.riffy?.players.get(interaction.guild.id);
      
      if (player && player.state !== 'DISCONNECTED') {
        const resolve = await client.riffy.resolve({
          query: query,
          requester: interaction.user,
        });

        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === 'playlist') {
          for (const track of tracks) {
            track.info.requester = interaction.user;
            player.queue.add(track);
          }
          
          const embed = {
            color: 0x1DB954,
            title: '📋 Danh sách phát đã thêm',
            description: `Đã thêm **${tracks.length}** bài hát từ danh sách phát: **${playlistInfo.name}**`,
            thumbnail: { url: playlistInfo.thumbnail },
            timestamp: new Date().toISOString()
          };
          
          await interaction.reply({ embeds: [embed] });
          if (!player.playing && !player.paused) return player.play();
        } else if (loadType === 'search' || loadType === 'track') {
          const track = tracks.shift();
          track.info.requester = interaction.user;
          player.queue.add(track);
          
          const embed = {
            color: 0x1DB954,
            title: '🎵 Bài hát đã thêm',
            description: `Đã thêm **${track.info.title}** vào hàng chờ`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
              { name: '⏱️ Thời lượng', value: formatDuration(track.info.length), inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await interaction.reply({ embeds: [embed] });
          if (!player.playing && !player.paused) return player.play();
        } else {
          await interaction.reply({ 
            content: '❌ Không tìm thấy kết quả cho truy vấn của bạn!', 
            flags: [64]
          });
        }
      } else {
        const resolve = await client.riffy.resolve({
          query: query,
          requester: interaction.user,
        });

        const { loadType, tracks } = resolve;

        if (loadType === 'search' || loadType === 'track') {
          const track = tracks[0];
          if (!track) {
            return interaction.reply({ 
              content: '❌ Không tìm thấy kết quả cho truy vấn của bạn!', 
              flags: [64]
            });
          }

          const newPlayer = await client.riffy.createConnection({
            guildId: interaction.guild.id,
            voiceChannel: voiceChannel.id,
            textChannel: interaction.channel.id,
            deaf: true,
          });

          track.info.requester = interaction.user;
          
          // Đợi trình phát sẵn sàng trước khi phát
          const waitForPlayer = () => {
            return new Promise((resolve, reject) => {
              const checkPlayer = () => {
                if (newPlayer.connected) {
                  resolve();
                } else {
                  setTimeout(checkPlayer, 100);
                }
              };
              checkPlayer();
            });
          };
          
          try {
            await waitForPlayer();
            console.log('Trình phát đã kết nối, thêm vào hàng chờ');
            newPlayer.queue.add(track);
            console.log('Bài hát đã thêm vào hàng chờ, kích thước:', newPlayer.queue.size);
            
            // Thử gọi phát với độ trễ
            setTimeout(() => {
              console.log('Cố gắng phát bị trễ:', {
                queueSize: newPlayer.queue.size,
                playing: newPlayer.playing,
                paused: newPlayer.paused
              });
              try {
                newPlayer.play();
              } catch (playError) {
                console.error('Lỗi phát bị trễ:', playError);
              }
            }, 500);
          } catch (error) {
            console.error('Lỗi kết nối trình phát:', error);
          }
          
          // Gỡ lỗi: Ghi lại cấu trúc trình phát
          console.log('Trình phát được tạo:', {
            guildId: interaction.guild.id,
            playerExists: !!client.riffy.players.get(interaction.guild.id),
            playerState: newPlayer.state,
            track: track.info.title
          });
          
          const embed = {
            color: 0x1DB954,
            title: '🎵 Đang phát',
            description: `**${track.info.title}**`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Nghệ sĩ', value: track.info.author, inline: true },
              { name: '⏱️ Thời lượng', value: formatDuration(track.info.length), inline: true },
              { name: '👤 Người yêu cầu', value: interaction.user.username, inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ 
            content: '❌ Không tìm thấy kết quả cho truy vấn của bạn!', 
            flags: [64]
          });
        }
      }
      
    } catch (error) {
      console.error('Lỗi lệnh phát:', error);
      await interaction.reply({ 
        content: '❌ Đã xảy ra lỗi khi cố gắng phát bài hát!', 
        flags: [64]
      });
    }
  }
};