module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.executeSlash(interaction, client);
    } catch (error) {
      console.error('Error executing slash command:', error);
      
      const errorMessage = 'There was an error while executing this command!';

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: errorMessage, flags: [64] }); // 64 = ephemeral
      } else {
        await interaction.reply({ content: errorMessage, flags: [64] });
      }
    }
  }
};