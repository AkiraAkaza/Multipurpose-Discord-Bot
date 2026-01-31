const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'warn',
  description: 'Cảnh báo một người dùng',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Cảnh báo một người dùng')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Người dùng cần cảnh báo')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Lý do cho cảnh báo')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return message.reply({ content: 'Bạn không có quyền cảnh báo thành viên!', flags: [64] });
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({ content: 'Vui lòng đề cập đến một người dùng để cảnh báo!', flags: [64] });
    }

    const reason = args.slice(1).join(' ') || 'Không có lý do cung cấp';

    try {
      // Lưu trữ cảnh báo trong cơ sở dữ liệu (đơn giản - bạn thường sẽ sử dụng cơ sở dữ liệu thích hợp)
      const warning = {
        userId: user.id,
        moderatorId: message.author.id,
        reason: reason,
        timestamp: new Date().toISOString()
      };

      // Đây là một cách tiếp cận đơn giản - trong sản xuất bạn sẽ sử dụng MongoDB
      const warnings = client.warnings || new Map();
      if (!warnings.has(user.id)) {
        warnings.set(user.id, []);
      }
      warnings.get(user.id).push(warning);
      client.warnings = warnings;

      await message.reply({ content: `✅ Đã cảnh báo thành công ${user.tag} vì: ${reason}` });

      // Cố gắng DM người dùng
      try {
        await user.send({
          content: `Bạn đã bị cảnh báo trong ${message.guild.name}\n**Lý do:** ${reason}\n**Người kiểm duyệt:** ${message.author.tag}`
        });
      } catch (err) {
        // Người dùng đã tắt DMs
      }

    } catch (error) {
      console.error('Lỗi cảnh báo:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi cố gắng cảnh báo người dùng đó!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'Không có lý do cung cấp';

    try {
      // Lưu trữ cảnh báo trong cơ sở dữ liệu
      const warning = {
        userId: user.id,
        moderatorId: interaction.user.id,
        reason: reason,
        timestamp: new Date().toISOString()
      };

      const warnings = interaction.client.warnings || new Map();
      if (!warnings.has(user.id)) {
        warnings.set(user.id, []);
      }
      warnings.get(user.id).push(warning);
      interaction.client.warnings = warnings;

      await interaction.reply({ content: `✅ Đã cảnh báo thành công ${user.tag} vì: ${reason}` });

      // Cố gắng DM người dùng
      try {
        await user.send({
          content: `Bạn đã bị cảnh báo trong ${interaction.guild.name}\n**Lý do:** ${reason}\n**Người kiểm duyệt:** ${interaction.user.tag}`
        });
      } catch (err) {
        // Người dùng đã tắt DMs
      }

    } catch (error) {
      console.error('Lỗi cảnh báo:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi cố gắng cảnh báo người dùng đó!', flags: [64] });
    }
  }
};