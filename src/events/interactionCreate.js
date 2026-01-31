const { loadData, saveData } = require("../utils/data");

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const data = loadData();
    const banned = data.bannedUsers[interaction.user.id];

    if (banned) {
      if (Date.now() < banned.expiresAt) {
          return interaction.reply({
              content: `Bạn bị cấm dùng bot đến <t:${Math.floor(banned.expiresAt / 1000)}:F>`
          });
      } else {
          delete data.bannedUsers[interaction.user.id];
          saveData(data);
      }
    }

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