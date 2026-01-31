const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Thông tin',
  name: 'userinfo',
  description: 'Lấy thông tin về người dùng',
  
  // Dữ liệu lệnh   (/)
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Lấy thông tin về người dùng')
    .addUserOption(option => 
      option.setName('target')
        .setDescription('Người dùng để lấy thông tin')
        .setRequired(false)),

  // Thực thi lệnh tiền tố
  async executePrefix(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.members.cache.get(user.id);

    const embed = {
      color: 0x0099FF,
      title: `Thông tin Người dùng - ${user.username}`,
      thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: 'Tên người dùng', value: user.tag, inline: true },
        { name: 'ID', value: user.id, inline: true },
        { name: 'Gia nhập máy chủ', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
        { name: 'Tài khoản được tạo', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await message.reply({ embeds: [embed] });
  },

  // Thực thi lệnh  (/)
  async executeSlash(interaction) {
    const user = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const embed = {
      color: 0x0099FF,
      title: `Thông tin Người dùng - ${user.username}`,
      thumbnail: { url: user.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: 'Tên người dùng', value: user.tag, inline: true },
        { name: 'ID', value: user.id, inline: true },
        { name: 'Gia nhập máy chủ', value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : 'N/A', inline: true },
        { name: 'Tài khoản được tạo', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};