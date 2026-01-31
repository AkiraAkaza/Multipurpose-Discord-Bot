const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'nickname',
  description: 'Thay đổi biệt danh của người dùng',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('nickname')
    .setDescription('Thay đổi biệt danh của người dùng')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Người dùng cần thay đổi biệt danh')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('nickname')
        .setDescription('Biệt danh mới (sử dụng "reset" để xóa)')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) {
      return message.reply({ content: 'Bạn không có quyền quản lý biệt danh!', flags: [64] });
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({ content: 'Vui lòng đề cập đến một người dùng!', flags: [64] });
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.manageable) {
      return message.reply({ content: 'Tôi không thể thay đổi biệt danh của người dùng này!', flags: [64] });
    }

    const nickname = args.slice(1).join(' ');

    try {
      if (nickname === 'reset') {
        await member.setNickname(null);
        await message.reply({ content: `✅ Đã đặt lại biệt danh của ${user.tag}` });
      } else if (nickname) {
        await member.setNickname(nickname);
        await message.reply({ content: `✅ Đã thay đổi biệt danh của ${user.tag} thành: **${nickname}**` });
      } else {
        await message.reply({ content: 'Vui lòng cung cấp một biệt danh hoặc sử dụng "reset" để xóa nó!', flags: [64] });
      }
    } catch (error) {
      console.error('Lỗi biệt danh:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi thay đổi biệt danh!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const nickname = interaction.options.getString('nickname');

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.manageable) {
      return interaction.reply({ content: 'Tôi không thể thay đổi biệt danh của người dùng này!', flags: [64] });
    }

    try {
      if (nickname === 'reset') {
        await member.setNickname(null);
        await interaction.reply({ content: `✅ Đã đặt lại biệt danh của ${user.tag}` });
      } else if (nickname) {
        await member.setNickname(nickname);
        await interaction.reply({ content: `✅ Đã thay đổi biệt danh của ${user.tag} thành: **${nickname}**` });
      } else {
        await interaction.reply({ content: 'Vui lòng cung cấp một biệt danh!', flags: [64] });
      }
    } catch (error) {
      console.error('Lỗi biệt danh:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi thay đổi biệt danh!', flags: [64] });
    }
  }
};