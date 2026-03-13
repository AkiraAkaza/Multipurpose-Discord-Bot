const ADMIN_IDS = [
  "1193190641811849268",
  "921214505797689436"
];

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.executeSlash(interaction, client);
      } catch (error) {
        console.error('Error executing slash command:', error);
        const errorMessage = 'There was an error while executing this command!';
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: errorMessage, flags: [64] });
        } else {
          await interaction.reply({ content: errorMessage, flags: [64] });
        }
      }
      return;
    }

    // =========================
    // Button interaction
    // =========================
    if (interaction.isButton()) {

      // chỉ admin mới bấm được
      if (!ADMIN_IDS.includes(interaction.user.id)) {
        return interaction.reply({
          content: "❌ Bạn không có quyền sử dụng nút này.",
          ephemeral: true
        });
      }

      const userId = interaction.customId.split("_")[1];

      let user;
      try {
        user = await client.users.fetch(userId);
      } catch {
        return interaction.reply({
          content: "❌ Không tìm thấy người dùng.",
          ephemeral: true
        });
      }
      if (interaction.customId.startsWith("approve_")) {
        await user.send(`
✅ **THẺ ĐÃ ĐƯỢC DUYỆT**

Rank của bạn đã được cấp thành công.
Cảm ơn bạn đã ủng hộ server ❤️
`);

        await interaction.update({
          content: "✅ Đã duyệt thẻ và cấp rank.",
          components: []
        });
      }
      if (interaction.customId.startsWith("reject_")) {
        await user.send(`
❌ **THẺ KHÔNG HỢP LỆ**

Thẻ bạn gửi không đúng hoặc đã được sử dụng.
Vui lòng kiểm tra lại và gửi lại thẻ mới.
`);

        await interaction.update({
          content: "❌ Đã từ chối thẻ.",
          components: []
        });
      }
    }
  }
};
