require('dotenv').config();

module.exports = {
  ADMIN_ID: process.env.ADMIN_ID,
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  prefix: '.'
};