const { Client, GatewayIntentBits, GatewayDispatchEvents } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const chalk = require("chalk");
const { Riffy } = require("riffy");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

const nodes = [
  {
    host: "lavalink.jirayu.net",
    password: "youshallnotpass",
    port: 13592,
    secure: false,
  },
];

client.riffy = new Riffy(client, nodes, {
  send: (payload) => {
    const guild = client.guilds.cache.get(payload.d.guild_id);
    if (guild) guild.shard.send(payload);
  },
  defaultSearchPlatform: "ytmsearch",
  restVersion: "v4",
});

async function startBot() {
  console.log(chalk.blue.bold("🚀 Đang khởi động Discord Bot..."));

  try {
    console.log("⏳ Đang tải các sự kiện...");
    const eventsPath = path.join(__dirname, "events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      console.log(`✓ Đã tải sự kiện: ${event.name}`);
    }

    // Xử lý sự kiện Riffy
    client.riffy.on("nodeConnect", (node) => {
      console.log(`Node "${node.name}" đã kết nối.`);
    });

    client.riffy.on("nodeError", (node, error) => {
      console.log(
        `Node "${node.name}" gặp lỗi: ${error.message}.`
      );
    });

    client.riffy.on("trackStart", async (player, track) => {
      console.log('Sự kiện trackStart được kích hoạt:', {
        guildId: player.guildId,
        trackTitle: track.info.title,
        playing: player.playing,
        paused: player.paused
      });
      const channel = client.channels.cache.get(player.textChannel);
      channel.send(
        `Đang phát: \`${track.info.title}\` của \`${track.info.author}\`.`
      );
    });

    client.riffy.on("queueEnd", async (player) => {
      const channel = client.channels.cache.get(player.textChannel);
      const autoplay = false;
      if (autoplay) {
        player.autoplay(player);
      } else {
        player.destroy();
        channel.send("Hàng chờ đã kết thúc.");
      }
    });

    client.on("raw", (d) => {
      if (
        ![
          GatewayDispatchEvents.VoiceStateUpdate,
          GatewayDispatchEvents.VoiceServerUpdate,
        ].includes(d.t)
      )
        return;
      client.riffy.updateVoiceState(d);
    });

    console.log("⏳ Đang đăng nhập vào Discord...");
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error(chalk.red.bold("✗ Không thể khởi động bot:"), error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (error) => {
  console.error(chalk.red.bold("✗ Lỗi Promise chưa được xử lý:"), error);
});

process.on("uncaughtException", (error) => {
  console.error(chalk.red.bold("✗ Ngoại lệ chưa được bắt:"), error);
  process.exit(1);
});

startBot();

const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server Node.js dang chay!");
});

server.listen(PORT, () => {
    console.log(`Server dang chay tai http://localhost:${PORT}`);
});
