const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'Kiểm duyệt',
  name: 'roleinfo',
  description: 'Lấy thông tin về một vai trò',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('roleinfo')
    .setDescription('Lấy thông tin về một vai trò')
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('Vai trò cần lấy thông tin')
        .setRequired(false)),

  async executePrefix(message, args, client) {
    let role;
    
    if (message.mentions.roles.first()) {
      role = message.mentions.roles.first();
    } else if (args[0]) {
      role = message.guild.roles.cache.find(r => 
        r.name.toLowerCase() === args.join(' ').toLowerCase() ||
        r.id === args[0] ||
        `<@&${r.id}>` === args[0]
      );
    } else {
      role = message.member.roles.highest;
    }

    if (!role) {
      return message.reply({ content: 'Không tìm thấy vai trò đó!', flags: [64] });
    }

    const embed = {
      color: role.color || 0x0099FF,
      title: `🎭 Thông tin vai trò: ${role.name}`,
      thumbnail: { url: role.iconURL() },
      fields: [
        { name: '🆔 ID Vai trò', value: role.id, inline: true },
        { name: '🏷️ Tên', value: role.name, inline: true },
        { name: '📅 Được tạo', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Thành viên', value: `${role.members.size}`, inline: true },
        { name: '🎨 Màu sắc', value: role.hexColor || 'Mặc định', inline: true },
        { name: '📍 Vị trí', value: `${role.position}`, inline: true },
        { name: '📋 Quyền hạn', value: role.permissions.bitfield.toString(), inline: false },
        { name: '⚙️ Tính năng', value: role.tags?.botId ? 'Vai trò Bot' : 'Vai trò thường', inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await message.reply({ embeds: [embed] });
  },

  async executeSlash(interaction) {
    let role = interaction.options.getRole('role');
    
    if (!role) {
      role = interaction.member.roles.highest;
    }

    const embed = {
      color: role.color || 0x0099FF,
      title: `🎭 Thông tin vai trò: ${role.name}`,
      thumbnail: { url: role.iconURL() },
      fields: [
        { name: '🆔 ID Vai trò', value: role.id, inline: true },
        { name: '🏷️ Tên', value: role.name, inline: true },
        { name: '📅 Được tạo', value: `<t:${Math.floor(role.createdTimestamp / 1000)}:R>`, inline: true },
        { name: '👥 Thành viên', value: `${role.members.size}`, inline: true },
        { name: '🎨 Màu sắc', value: role.hexColor || 'Mặc định', inline: true },
        { name: '📍 Vị trí', value: `${role.position}`, inline: true },
        { name: '📋 Quyền hạn', value: role.permissions.bitfield.toString(), inline: false },
        { name: '⚙️ Tính năng', value: role.tags?.botId ? 'Vai trò Bot' : 'Vai trò thường', inline: true }
      ],
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};