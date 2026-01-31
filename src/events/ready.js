const { loadCommands } = require('../utils/handler');
const { REST, Routes } = require('discord.js');
const chalk = require('chalk');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    console.log(chalk.blue.bold(`Đã đăng nhập ${client.user.tag}`));
    console.log(chalk.blue.bold(`Sẵn sàng phục vụ trong ${client.guilds.cache.size} máy chủ`));

    client.config = require('../config');
    client.commands = new Map();
    client.slashCommands = new Map();

    // Khởi tạo Riffy
    client.riffy.init(client.user.id);

    loadCommands(client);

    const slashCommands = [];
    client.slashCommands.forEach(command => {
      slashCommands.push(command.data.toJSON());
    });

    const rest = new REST({ version: '10' }).setToken(client.config.token);

    try {
      console.log('⏳ Đang làm mới các lệnh (/) ...');

      await rest.put(
        Routes.applicationCommands(client.config.clientId),
        { body: slashCommands }
      );

      console.log(chalk.green.bold('Đã làm mới thành công các lệnh (/) '));
      console.log(chalk.yellow('⚠️ Các lệnh (/) có thể mất tới 1 giờ để bắt đầu hoạt động trên tất cả các máy chủ!'));
    } catch (error) {
      console.error(chalk.red.bold('Lỗi khi làm mới các lệnh (/) :'), error);
    }

    client.user.setActivity(`${client.config.prefix}help | /help`, { type: 'WATCHING' });
  }
};