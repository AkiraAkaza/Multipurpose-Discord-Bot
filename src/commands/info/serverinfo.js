const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Thông tin',
  name: 'serverinfo',
  description: 'Lấy thông tin về máy chủ',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Lấy thông tin về máy chủ'),

  async executePrefix(message, args, client) {
    const guild = message.guild;

    const embed = {
      color: 0x0099FF,
      title: `📊 Thông tin Máy chủ - ${guild.name}`,
      thumbnail: { url: guild.iconURL({ dynamic: true, size: 256 }) },
      fields: [
        { name: '🆔 ID Máy chủ', value: guild.id, inline: true },
        { name: '👑 Chủ sở hữu', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Thành viên', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Tạo lúc', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '💬 Kênh', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Vai trò', value: `${guild.roles.cache.size}`, inline: true },
        { name: '🚀 Mức Boost', value: `Cấp ${guild.premiumTier}`, inline: true },
        { name: '💎 Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await message.reply({ embeds: [embed] });
  },

  async executeSlash(interaction) {
    const guild = interaction.guild;

    const embed = {
      color: 0x0099FF,
      title: `📊 Thông tin Máy chủ - ${guild.name}`,
      thumbnail: { url: guild.iconURL({ dynamic: true, size: 256 }) },
      fields: [
        { name: '🆔 ID Máy chủ', value: guild.id, inline: true },
        { name: '👑 Chủ sở hữu', value: `<@${guild.ownerId}>`, inline: true },
        { name: '👥 Thành viên', value: `${guild.memberCount}`, inline: true },
        { name: '📅 Tạo lúc', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
        { name: '💬 Kênh', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Vai trò', value: `${guild.roles.cache.size}`, inline: true },
        { name: '🚀 Mức Boost', value: `Cấp ${guild.premiumTier}`, inline: true },
        { name: '💎 Boosts', value: `${guild.premiumSubscriptionCount || 0}`, inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};