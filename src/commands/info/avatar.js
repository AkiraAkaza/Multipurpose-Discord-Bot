const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Thông tin',
  name: 'avatar',
  description: 'Lấy avatar của người dùng',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Lấy avatar của người dùng')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Người dùng để lấy avatar')
        .setRequired(false)),

  async executePrefix(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    
    const embed = {
      color: 0x00D26A,
      title: `Avatar của ${user.username}`,
      image: { 
        url: user.displayAvatarURL({ 
          dynamic: true, 
          size: 1024 
        }) 
      },
      footer: { 
        text: `Nhấp vào hình ảnh để mở trong trình duyệt` 
      },
      timestamp: new Date().toISOString()
    };

    await message.reply({ embeds: [embed] });
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    
    const embed = {
      color: 0x00D26A,
      title: `Avatar của ${user.username}`,
      image: { 
        url: user.displayAvatarURL({ 
          dynamic: true, 
          size: 1024 
        }) 
      },
      footer: { 
        text: `Nhấp vào hình ảnh để mở trong trình duyệt` 
      },
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};