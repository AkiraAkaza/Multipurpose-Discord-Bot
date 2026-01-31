const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'unlock',
  description: 'Mở khóa kênh để cho phép gửi tin nhắn',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Mở khóa kênh để cho phép gửi tin nhắn')
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Lý do mở khóa kênh')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ content: 'Bạn không có quyền quản lý kênh!', flags: [64] });
    }

    const reason = args.join(' ') || 'Không có lý do cung cấp';

    try {
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: null
      });

      await message.reply({ content: `🔓 Kênh đã được mở khóa. Lý do: ${reason}` });
    } catch (error) {
      console.error('Lỗi mở khóa:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi mở khóa kênh!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const reason = interaction.options.getString('reason') || 'Không có lý do cung cấp';

    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null
      });

      await interaction.reply({ content: `🔓 Kênh đã được mở khóa. Lý do: ${reason}` });
    } catch (error) {
      console.error('Lỗi mở khóa:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi mở khóa kênh!', flags: [64] });
    }
  }
};