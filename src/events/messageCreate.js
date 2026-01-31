const { loadData, saveData } = require("../utils/data");

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;
    if (!message.guild) return;

    const config = client.config || require('../config');
    const prefix = config.prefix;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const data = loadData();
    const banned = data.bannedUsers[message.author.id];

    if (banned) {
      if (Date.now() < banned.expiresAt) {
          return message.reply(`Bạn bị cấm dùng bot đến <t:${Math.floor(banned.expiresAt / 1000)}:F>`);
      } else {
          delete data.bannedUsers[message.author.id];
          saveData(data);
      }
    }

    const command = client.commands.get(commandName);

    if (!command || command.slashOnly) return;

    try {
      await command.executePrefix(message, args, client);
    } catch (error) {
      console.error('Lỗi khi thực thi lệnh tiền tố:', error);
      await message.reply('Đã xảy ra lỗi khi thực thi lệnh này!');
    }
  }
};