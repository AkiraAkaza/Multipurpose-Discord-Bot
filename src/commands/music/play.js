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
  category: 'Music',
  name: 'play',
  description: 'Play a song or add it to the queue',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or add it to the queue')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Song name or URL to play')
        .setRequired(true)),

  async executePrefix(message, args, client) {
    if (!args[0]) {
      return message.reply({ 
        content: 'Usage: `!play <song name or URL>`', 
        flags: [64]
      });
    }

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply({ 
        content: '❌ You need to be in a voice channel to play music!', 
        flags: [64]
      });
    }

    const permissions = voiceChannel.permissionsFor(message.guild.members.me);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return message.reply({ 
        content: '❌ I need permission to connect and speak in your voice channel!', 
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
            title: '📋 Playlist Added',
            description: `Added **${tracks.length}** tracks from playlist: **${playlistInfo.name}**`,
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
            title: '🎵 Track Added',
            description: `Added **${track.info.title}** to queue`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Artist', value: track.info.author, inline: true },
              { name: '⏱️ Duration', value: formatDuration(track.info.length), inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await message.reply({ embeds: [embed] });
          if (!player.playing && !player.paused) return player.play();
        } else {
          await message.reply({ 
            content: '❌ No results found for your query!', 
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
              content: '❌ No results found for your query!', 
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
          
          // Wait for player to be ready before playing
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
            console.log('Player connected (prefix), adding to queue');
            newPlayer.queue.add(track);
            console.log('Track added to queue, size:', newPlayer.queue.size);
            
            // Try calling play with a delay
            setTimeout(() => {
              console.log('Attempting delayed play (prefix):', {
                queueSize: newPlayer.queue.size,
                playing: newPlayer.playing,
                paused: newPlayer.paused
              });
              try {
                newPlayer.play();
              } catch (playError) {
                console.error('Delayed play error (prefix):', playError);
              }
            }, 500);
          } catch (error) {
            console.error('Player connection error (prefix):', error);
          }
          
          const embed = {
            color: 0x1DB954,
            title: '🎵 Now Playing',
            description: `**${track.info.title}**`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Artist', value: track.info.author, inline: true },
              { name: '⏱️ Duration', value: formatDuration(track.info.length), inline: true },
              { name: '👤 Requester', value: message.author.username, inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await message.reply({ embeds: [embed] });
        } else {
          await message.reply({ 
            content: '❌ No results found for your query!', 
            flags: [64]
          });
        }
      }
      
    } catch (error) {
      console.error('Play command error:', error);
      await message.reply({ 
        content: '❌ An error occurred while trying to play the song!', 
        flags: [64]
      });
    }
  },

  async executeSlash(interaction, client) {
    const query = interaction.options.getString('query');
    
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({ 
        content: '❌ You need to be in a voice channel to play music!', 
        flags: [64]
      });
    }

    const permissions = voiceChannel.permissionsFor(interaction.guild.members.me);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
      return interaction.reply({ 
        content: '❌ I need permission to connect and speak in your voice channel!', 
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
            title: '📋 Playlist Added',
            description: `Added **${tracks.length}** tracks from playlist: **${playlistInfo.name}**`,
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
            title: '🎵 Track Added',
            description: `Added **${track.info.title}** to queue`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Artist', value: track.info.author, inline: true },
              { name: '⏱️ Duration', value: formatDuration(track.info.length), inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await interaction.reply({ embeds: [embed] });
          if (!player.playing && !player.paused) return player.play();
        } else {
          await interaction.reply({ 
            content: '❌ No results found for your query!', 
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
              content: '❌ No results found for your query!', 
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
          
          // Wait for player to be ready before playing
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
            console.log('Player connected, adding to queue');
            newPlayer.queue.add(track);
            console.log('Track added to queue, size:', newPlayer.queue.size);
            
            // Try calling play with a delay
            setTimeout(() => {
              console.log('Attempting delayed play:', {
                queueSize: newPlayer.queue.size,
                playing: newPlayer.playing,
                paused: newPlayer.paused
              });
              try {
                newPlayer.play();
              } catch (playError) {
                console.error('Delayed play error:', playError);
              }
            }, 500);
          } catch (error) {
            console.error('Player connection error:', error);
          }
          
          // Debug: Log player structure
          console.log('Player created:', {
            guildId: interaction.guild.id,
            playerExists: !!client.riffy.players.get(interaction.guild.id),
            playerState: newPlayer.state,
            track: track.info.title
          });
          
          const embed = {
            color: 0x1DB954,
            title: '🎵 Now Playing',
            description: `**${track.info.title}**`,
            thumbnail: { url: track.info.thumbnail },
            fields: [
              { name: '👤 Artist', value: track.info.author, inline: true },
              { name: '⏱️ Duration', value: formatDuration(track.info.length), inline: true },
              { name: '👤 Requester', value: interaction.user.username, inline: true }
            ],
            timestamp: new Date().toISOString()
          };
          
          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply({ 
            content: '❌ No results found for your query!', 
            flags: [64]
          });
        }
      }
      
    } catch (error) {
      console.error('Play command error:', error);
      await interaction.reply({ 
        content: '❌ An error occurred while trying to play the song!', 
        flags: [64]
      });
    }
  }
};