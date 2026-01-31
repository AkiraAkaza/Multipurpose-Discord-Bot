const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'timeout',
  description: 'Hết thời gian chờ một người dùng trong thời gian quy định',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Hết thời gian chờ một người dùng trong thời gian quy định')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Người dùng cần hết thời gian chờ')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('duration')
        .setDescription('Thời lượng hết thời gian chờ (ví dụ: 1m, 1h, 1d)')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('reason')
        .setDescription('Lý do hết thời gian chờ')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply({ content: 'Bạn không có quyền hết thời gian chờ thành viên!', flags: [64] });
    }

    const user = message.mentions.users.first();
    if (!user) {
      return message.reply({ content: 'Vui lòng đề cập đến một người dùng để hết thời gian chờ!', flags: [64] });
    }

    const duration = args[1];
    if (!duration) {
      return message.reply({ content: 'Vui lòng chỉ định một thời lượng (ví dụ: 1m, 1h, 1d)!', flags: [64] });
    }

    const member = message.guild.members.cache.get(user.id);
    if (!member) {
      return message.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.moderatable) {
      return message.reply({ content: 'Tôi không thể hết thời gian chờ người dùng này!', flags: [64] });
    }

    const reason = args.slice(2).join(' ') || 'Không có lý do cung cấp';
    const timeoutDuration = parseDuration(duration);

    if (!timeoutDuration) {
      return message.reply({ content: 'Thời lượng không hợp lệ! Sử dụng: 1s, 1m, 1h, 1d', flags: [64] });
    }

    try {
      await member.timeout(timeoutDuration, reason);
      await message.reply({ content: `✅ Đã hết thời gian chờ thành công ${user.tag} trong ${duration} - ${reason}` });
    } catch (error) {
      console.error('Lỗi hết thời gian chờ:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi cố gắng hết thời gian chờ người dùng đó!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'Không có lý do cung cấp';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) {
      return interaction.reply({ content: 'Người dùng đó không ở trong máy chủ này!', flags: [64] });
    }

    if (!member.moderatable) {
      return interaction.reply({ content: 'Tôi không thể hết thời gian chờ người dùng này!', flags: [64] });
    }

    const timeoutDuration = parseDuration(duration);

    if (!timeoutDuration) {
      return interaction.reply({ content: 'Thời lượng không hợp lệ! Sử dụng: 1s, 1m, 1h, 1d', flags: [64] });
    }

    try {
      await member.timeout(timeoutDuration, reason);
      await interaction.reply({ content: `✅ Đã hết thời gian chờ thành công ${user.tag} trong ${duration} - ${reason}` });
    } catch (error) {
      console.error('Lỗi hết thời gian chờ:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi cố gắng hết thời gian chờ người dùng đó!', flags: [64] });
    }
  }
};

function parseDuration(durationStr) {
  const match = durationStr.match(/^(\d+)([smhd])$/);
  if (!match) return null;

  const [, amount, unit] = match;
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return parseInt(amount) * multipliers[unit];
}