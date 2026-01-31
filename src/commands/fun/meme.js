const { SlashCommandBuilder } = require('discord.js');
const https = require('https');

module.exports = {
  category: 'Giải trí',
  name: 'meme',
  description: 'Lấy một meme ngẫu nhiên',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Lấy một meme ngẫu nhiên'),

  async executePrefix(message, args, client) {
    try {
      // Sử dụng API meme công khai với mô-đun https tích hợp sẵn
      const data = await new Promise((resolve, reject) => {
        https.get('https://meme-api.com/gimme', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', reject);
      });

      if (!data.url) {
        return message.reply({ content: 'Không thể lấy meme vào lúc này. Vui lòng thử lại sau!', flags: [64] });
      }

      const embed = {
        color: 0x00D26A,
        title: `🎭 ${data.title || 'Meme Ngẫu Nhiên'}`,
        image: { url: data.url },
        footer: { text: `👍 ${data.ups} ups` },
        timestamp: new Date().toISOString()
      };

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Lỗi Meme:', error);
      await message.reply({ content: 'Không thể lấy meme vào lúc này. Vui lòng thử lại sau!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    try {
      // Sử dụng API meme công khai với mô-đun https tích hợp sẵn
      const data = await new Promise((resolve, reject) => {
        https.get('https://meme-api.com/gimme', (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }).on('error', reject);
      });

      if (!data.url) {
        return interaction.reply({ content: 'Không thể lấy meme vào lúc này. Vui lòng thử lại sau!', flags: [64] });
      }

      const embed = {
        color: 0x00D26A,
        title: `🎭 ${data.title || 'Meme Ngẫu Nhiên'}`,
        image: { url: data.url },
        footer: { text: `👍 ${data.ups} ups` },
        timestamp: new Date().toISOString()
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Lỗi Meme:', error);
      await interaction.reply({ content: 'Không thể lấy meme vào lúc này. Vui lòng thử lại sau!', flags: [64] });
    }
  }
};