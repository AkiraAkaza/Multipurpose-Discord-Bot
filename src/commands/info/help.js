const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Info',
  name: 'help',
  description: 'Show all available commands',
  slashOnly: false, // Allow both prefix and slash
  
  // Slash command data
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Filter commands by category')
        .addChoices(
          { name: 'Utility', value: 'utility' },
          { name: 'Info', value: 'info' },
          { name: 'Moderation', value: 'moderation' },
          { name: 'Fun', value: 'fun' },
          { name: 'Economy', value: 'economy' },
          { name: 'Music', value: 'music' }
        )),

  // Prefix command execution
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
      .setTitle('Help Menu')
      .setDescription('Here are all available commands:');

    Object.keys(categories).forEach(category => {
      const commands = categories[category].map(cmd => `\`${client.config.prefix}${cmd.name}\` - ${cmd.description}`).join('\n');
      embed.addFields({ name: `${category} Commands`, value: commands });
    });

    embed.setTimestamp();

    await message.reply({ embeds: [embed] });
  },

  // Slash command execution
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
      .setTitle('Help Menu');

    if (category) {
      const categoryCommands = categories[category];
      if (categoryCommands) {
        embed.setDescription(`**${category} Commands:**`);
        const commandList = categoryCommands.map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`).join('\n');
        embed.addFields({ name: 'Commands', value: commandList });
      } else {
        embed.setDescription('No commands found for this category.');
      }
    } else {
      embed.setDescription('Here are all available commands:');
      Object.keys(categories).forEach(cat => {
        const commandList = categories[cat].map(cmd => `\`/${cmd.data.name}\` - ${cmd.data.description}`).join('\n');
        embed.addFields({ name: `${cat} Commands`, value: commandList });
      });
    }

    embed.setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
};