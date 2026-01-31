const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Thông tin',
  name: 'help',
  description: 'Hiển thị tất cả các lệnh có sẵn',
  slashOnly: false, // Cho phép cả tiền tố và (/)
  
  // Dữ liệu lệnh (/)
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Hiển thị tất cả các lệnh có sẵn')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Lọc lệnh theo danh mục')
        .addChoices(
          { name: 'Tiện ích', value: 'utility' },
          { name: 'Thông tin', value: 'info' },
          { name: 'Kiểm duyệt', value: 'moderation' },
          { name: 'Giải trí', value: 'fun' },
          { name: 'Kinh tế', value: 'economy' },
          { name: 'Âm nhạc', value: 'music' }
        )),

  // Thực thi lệnh tiền tố
  async executePrefix(message, args, client) {
    const { EmbedBuilder } = require('discord.js');
    
    const prefixCommands = Array.from(client.commands.values()).filter(cmd => !cmd.slashOnly);
    const categories = {};

    prefixCommands.forEach(cmd => {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd);
    });

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Trình đơn Trợ giúp')
      .setDescription('Đây là tất cả các lệnh có sẵn:');

    Object.keys(categories).forEach(category => {
      const commands = categories[category].map(cmd => `\`${client.config.prefix}${cmd.name}\` - ${cmd.description}`).join('\n');
      embed.addFields({ name: `Lệnh ${category}`, value: commands });
    });

    embed.setTimestamp();

    await message.reply({ embeds: [embed] });
  },

  // Thực thi lệnh (/)
  async executeSlash(interaction) {
    const { commands } = interaction.client;
    const category = interaction.options.getString('category');
    const slashCommands = Array.from(commands.values()).filter(cmd => cmd.data);
    
    const categories = {};
    
    slashCommands.forEach(cmd => {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd);
    });

    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Trình đơn Trợ giúp');

    if (category) {
      const categoryCommands = categories[category];
      if (categoryCommands) {
        embed.setDescription(`**Lệnh ${category}:**`);
        const commandList = categoryCommands.map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`).join('\n');
        embed.addFields({ name: 'Lệnh', value: commandList });
      } else {
        embed.setDescription('Không tìm thấy lệnh nào cho danh mục này.');
      }
    } else {
      embed.setDescription('Đây là tất cả các lệnh có sẵn:');
      Object.keys(categories).forEach(cat => {
        const commandList = categories[cat].map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`).join('\n');
        embed.addFields({ name: `Lệnh ${cat}`, value: commandList });
      });
    }

    embed.setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};