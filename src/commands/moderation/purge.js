const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'purge',
  description: 'Xóa tin nhắn từ kênh với các bộ lọc khác nhau',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Xóa tin nhắn từ kênh với các bộ lọc khác nhau')
    .addIntegerOption(option => 
      option.setName('amount')
        .setDescription('Số lượng tin nhắn cần xóa (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100))
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Xóa tin nhắn từ người dùng cụ thể')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('contains')
        .setDescription('Xóa tin nhắn chứa văn bản này')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('after')
        .setDescription('Xóa tin nhắn sau ID tin nhắn này')
        .setRequired(false))
    .addStringOption(option => 
      option.setName('before')
        .setDescription('Xóa tin nhắn trước ID tin nhắn này')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async executePrefix(message, args, client) {
    if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return message.reply({ content: 'Bạn không có quyền quản lý tin nhắn!', flags: [64] });
    }

    if (!args[0]) {
      return message.reply({ 
        content: 'Cách dùng: `!purge <số lượng> [người dùng] [chứa] [sau/trước: message_id]`',
        flags: [64]
      });
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount < 1 || amount > 100) {
      return message.reply({ content: 'Vui lòng chỉ định một số từ 1 đến 100!', flags: [64] });
    }

    try {
      await message.delete();
      
      let options = { limit: Math.min(amount, 100) };
      
      // Phân tích các đối số bổ sung
      for (let i = 1; i < args.length; i++) {
        const arg = args[i];
        
        // Kiểm tra đề cập người dùng
        const userMatch = arg.match(/^<@!?(\d+)>$/);
        if (userMatch) {
          const userId = userMatch[1];
          options.before = message.id;
          break;
        }
      }

      const messages = await message.channel.messages.fetch(options);
      let filtered = messages;

      // Lọc theo người dùng nếu được đề cập
      const userMention = args.find(arg => arg.match(/^<@!?(\d+)>$/));
      if (userMention) {
        const userId = userMention.match(/^<@!?(\d+)>$/)[1];
        filtered = messages.filter(m => m.author.id === userId);
      }

      // Lọc theo nội dung nếu được chỉ định
      const contentArg = args.find(arg => !arg.match(/^<@!?(\d+)>$/) && !arg.match(/^\d+$/));
      if (contentArg) {
        filtered = filtered.filter(m => m.content.toLowerCase().includes(contentArg.toLowerCase()));
      }

      if (filtered.size === 0) {
        return message.channel.send({ 
          content: '✨ Không tìm thấy tin nhắn nào phù hợp với tiêu chí!' 
        }).then(msg => setTimeout(() => msg.delete(), 3000));
      }

      const deleted = await message.channel.bulkDelete(filtered, true);
      
      await message.channel.send({
        content: `🗑️ Đã xóa thành công **${deleted.size}** tin nhắn!`,
        flags: [64]
      }).then(msg => {
        setTimeout(() => msg.delete(), 5000);
      });
      
    } catch (error) {
      console.error('Lỗi xóa:', error);
      await message.reply({ content: 'Đã xảy ra lỗi khi xóa tin nhắn!', flags: [64] });
    }
  },

  async executeSlash(interaction) {
    const amount = interaction.options.getInteger('amount');
    const user = interaction.options.getUser('user');
    const contains = interaction.options.getString('contains');
    const after = interaction.options.getString('after');
    const before = interaction.options.getString('before');

    try {
      let options = { limit: Math.min(amount, 100) };
      if (after) options.after = after;
      if (before) options.before = before;

      const messages = await interaction.channel.messages.fetch(options);
      let filtered = messages;

      // Áp dụng các bộ lọc
      if (user) {
        filtered = filtered.filter(m => m.author.id === user.id);
      }

      if (contains) {
        filtered = filtered.filter(m => m.content.toLowerCase().includes(contains.toLowerCase()));
      }

      if (filtered.size === 0) {
        return interaction.reply({ 
          content: '✨ Không tìm thấy tin nhắn nào phù hợp với tiêu chí!',
          flags: [64]
        });
      }

      const deleted = await interaction.channel.bulkDelete(filtered, true);
      
      await interaction.reply({
        content: `🗑️ Đã xóa thành công **${deleted.size}** tin nhắn!`,
        flags: [64]
      }).then(msg => {
        setTimeout(() => msg.delete(), 5000);
      });
      
    } catch (error) {
      console.error('Lỗi xóa:', error);
      await interaction.reply({ content: 'Đã xảy ra lỗi khi xóa tin nhắn!', flags: [64] });
    }
  }
};