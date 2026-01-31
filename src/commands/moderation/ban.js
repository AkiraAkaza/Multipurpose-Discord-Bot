const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'ban',
  description: 'Cấm một người dùng khỏi máy chủ',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Cấm một người dùng khỏi máy chủ')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Người dùng cần cấm')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Lý do cấm')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ content: 'Bạn không có quyền cấm thành viên!', flags: [64] });
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({ content: 'Vui lòng đề cập đến một người dùng để cấm!', flags: [64] });
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.bannable) {
      return message.reply({ content: 'Tôi không thể cấm người dùng này!', flags: [64] });
    }

    const reason = args.slice(1).join(' ') || 'Không có lý do cung cấp';

    try {
      await member.ban({ reason });
      await message.reply({ content: `✅ Đã cấm thành công ${user.tag} vì: ${reason}` });
    } catch (error) {
      console.error('Lỗi cấm:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi cố gắng cấm người dùng đó!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Không có lý do cung cấp';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.bannable) {
      return interaction.reply({ content: 'Tôi không thể cấm người dùng này!', flags: [64] });
    }

    try {
      await member.ban({ reason });
      await interaction.reply({ content: `✅ Đã cấm thành công ${user.tag} vì: ${reason}` });
    } catch (error) {
      console.error('Lỗi cấm:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi cố gắng cấm người dùng đó!', flags: [64] });
    }
  }
};