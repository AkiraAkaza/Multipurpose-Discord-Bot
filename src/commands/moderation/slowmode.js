const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'slowmode',
  description: 'Đặt chế độ chậm cho kênh',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Đặt chế độ chậm cho kênh')
    .addStringOption(option => 
      option.setName('duration')
        .setDescription('Thời lượng chế độ chậm (ví dụ: 5s, 1m, off)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return message.reply({ content: 'Bạn không có quyền quản lý kênh!', flags: [64] });
    }

    const duration = args[0];
    if (!duration) {
      return message.reply({ content: 'Vui lòng chỉ định một thời lượng (ví dụ: 5s, 1m, off)!', flags: [64] });
    }

    let seconds = 0;

    if (duration.toLowerCase() === 'off') {
      seconds = 0;
    } else {
      const match = duration.match(/^(\d+)([smhd])$/);
      if (!match) {
        return message.reply({ content: 'Thời lượng không hợp lệ! Sử dụng: 5s, 1m, off', flags: [64] });
      }

      const [, amount, unit] = match;
      const multipliers = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 24 * 60 * 60
      };

      seconds = Math.min(parseInt(amount) * multipliers[unit], 21600); // Tối đa 6 giờ
    }

    try {
      await message.channel.setRateLimitPerUser(seconds);
      
      if (seconds === 0) {
        await message.reply({ content: `✅ Chế độ chậm đã bị tắt trong kênh này.` });
      } else {
        await message.reply({ content: `✅ Chế độ chậm đã được đặt thành ${duration} trong kênh này.` });
      }
    } catch (error) {
      console.error('Lỗi chế độ chậm:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi đặt chế độ chậm!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const duration = interaction.options.getString('duration');
    let seconds = 0;

    if (duration.toLowerCase() === 'off') {
      seconds = 0;
    } else {
      const match = duration.match(/^(\d+)([smhd])$/);
      if (!match) {
        return interaction.reply({ content: 'Thời lượng không hợp lệ! Sử dụng: 5s, 1m, off', flags: [64] });
      }

      const [, amount, unit] = match;
      const multipliers = {
        s: 1,
        m: 60,
        h: 60 * 60,
        d: 24 * 60 * 60
      };

      seconds = Math.min(parseInt(amount) * multipliers[unit], 21600); // Tối đa 6 giờ
    }

    try {
      await interaction.channel.setRateLimitPerUser(seconds);
      
      if (seconds === 0) {
        await interaction.reply({ content: `✅ Chế độ chậm đã bị tắt trong kênh này.` });
      } else {
        await interaction.reply({ content: `✅ Chế độ chậm đã được đặt thành ${duration} trong kênh này.` });
      }
    } catch (error) {
      console.error('Lỗi chế độ chậm:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi đặt chế độ chậm!', flags: [64] });
    }
  }
};