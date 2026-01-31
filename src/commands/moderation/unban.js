const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'unban',
  description: 'Bỏ cấm người dùng khỏi máy chủ',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Bỏ cấm người dùng khỏi máy chủ')
    .addStringOption(option => 
      option.setName('user')
        .setDescription('ID người dùng hoặc tên để bỏ cấm')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Lý do bỏ cấm')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return message.reply({ content: 'Bạn không có quyền bỏ cấm thành viên!', flags: [64] });
    }

    const userIdentifier = args[0];
    if (!userIdentifier) {
      return message.reply({ content: 'Vui lòng cung cấp ID người dùng hoặc tên để bỏ cấm!', flags: [64] });
    }

    const reason = args.slice(1).join(' ') || 'Không có lý do cung cấp';

    try {
      const bannedUsers = await message.guild.bans.fetch();
      const bannedUser = bannedUsers.find(ban => 
        ban.user.id === userIdentifier || 
        ban.user.tag.toLowerCase().includes(userIdentifier.toLowerCase())
      );

      if (!bannedUser) {
        return message.reply({ content: 'Không tìm thấy người dùng bị cấm với mã định danh đó!', flags: [64] });
      }

      await message.guild.bans.remove(bannedUser.user, reason);
      await message.reply({ content: `✅ Đã bỏ cấm thành công ${bannedUser.user.tag} vì: ${reason}` });
    } catch (error) {
      console.error('Lỗi bỏ cấm:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi cố gắng bỏ cấm người dùng đó!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const userIdentifier = interaction.options.getString('user');
    const reason = interaction.options.getString('reason') || 'Không có lý do cung cấp';

    try {
      const bannedUsers = await interaction.guild.bans.fetch();
      const bannedUser = bannedUsers.find(ban => 
        ban.user.id === userIdentifier || 
        ban.user.tag.toLowerCase().includes(userIdentifier.toLowerCase())
      );

      if (!bannedUser) {
        return interaction.reply({ content: 'Không tìm thấy người dùng bị cấm với mã định danh đó!', flags: [64] });
      }

      await interaction.guild.bans.remove(bannedUser.user, reason);
      await interaction.reply({ content: `✅ Đã bỏ cấm thành công ${bannedUser.user.tag} vì: ${reason}` });
    } catch (error) {
      console.error('Lỗi bỏ cấm:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi cố gắng bỏ cấm người dùng đó!', flags: [64] });
    }
  }
};