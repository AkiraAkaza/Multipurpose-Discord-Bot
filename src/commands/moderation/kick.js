const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'kick',
  description: 'Loại bỏ một người dùng khỏi máy chủ',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Loại bỏ một người dùng khỏi máy chủ')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Người dùng cần loại bỏ')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Lý do loại bỏ')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply({ content: 'Bạn không có quyền loại bỏ thành viên!', flags: [64] });
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({ content: 'Vui lòng đề cập đến một người dùng để loại bỏ!', flags: [64] });
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.kickable) {
      return message.reply({ content: 'Tôi không thể loại bỏ người dùng này!', flags: [64] });
    }

    const reason = args.slice(1).join(' ') || 'Không có lý do cung cấp';

    try {
      await member.kick(reason);
      await message.reply({ content: `✅ Đã loại bỏ thành công ${user.tag} vì: ${reason}` });
    } catch (error) {
      console.error('Lỗi loại bỏ:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi cố gắng loại bỏ người dùng đó!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Không có lý do cung cấp';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.kickable) {
      return interaction.reply({ content: 'Tôi không thể loại bỏ người dùng này!', flags: [64] });
    }

    try {
      await member.kick(reason);
      await interaction.reply({ content: `✅ Đã loại bỏ thành công ${user.tag} vì: ${reason}` });
    } catch (error) {
      console.error('Lỗi loại bỏ:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi cố gắng loại bỏ người dùng đó!', flags: [64] });
    }
  }
};