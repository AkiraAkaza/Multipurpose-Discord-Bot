const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'warnings',
  description: 'Kiểm tra cảnh báo cho một người dùng',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Kiểm tra cảnh báo cho một người dùng')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('Người dùng cần kiểm tra cảnh báo')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async executePrefix(message, args, client) {
    const user = message.mentions.users.first() || message.author;
    
    const warnings = client.warnings || new Map();
    const userWarnings = warnings.get(user.id) || [];

    if (userWarnings.length === 0) {
      return message.reply({ content: `${user.tag} không có cảnh báo nào!` });
    }

    const embed = {
      color: 0xFF9800,
      title: `⚠️ Cảnh báo cho ${user.tag}`,
      description: `Tổng cảnh báo: ${userWarnings.length}`,
      fields: userWarnings.map((warning, index) => ({
        name: `Cảnh báo #${index + 1}`,
        value: `**Lý do:** ${warning.reason}\n**Ngày:** <t:${Math.floor(new Date(warning.timestamp).getTime() / 1000)}:F>\n**Người kiểm duyệt:** <@${warning.moderatorId}>`,
        inline: false
      })),
      timestamp: new Date().toISOString()
    };

    await message.reply({ embeds: [embed] });
  },

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    
    const warnings = interaction.client.warnings || new Map();
    const userWarnings = warnings.get(user.id) || [];

    if (userWarnings.length === 0) {
      return interaction.reply({ content: `${user.tag} không có cảnh báo nào!` });
    }

    const embed = {
      color: 0xFF9800,
      title: `⚠️ Cảnh báo cho ${user.tag}`,
      description: `Tổng cảnh báo: ${userWarnings.length}`,
      fields: userWarnings.map((warning, index) => ({
        name: `Cảnh báo #${index + 1}`,
        value: `**Lý do:** ${warning.reason}\n**Ngày:** <t:${Math.floor(new Date(warning.timestamp).getTime() / 1000)}:F>\n**Người kiểm duyệt:** <@${warning.moderatorId}>`,
        inline: false
      })),
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};