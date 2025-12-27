const {
  Client,
  GatewayIntentBits,
  GatewayDispatchEvents,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const chalk = require("chalk");
const connectDB = require("./utils/database");
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
  console.log(chalk.blue.bold("🚀 Starting Discord Bot..."));

  try {
    console.log("⏳ Connecting to MongoDB...");
    await connectDB();

    console.log("⏳ Loading events...");
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
      console.log(`✓ Loaded event: ${event.name}`);
    }

    // Riffy event handlers
    client.riffy.on("nodeConnect", (node) => {
      console.log(`Node "${node.name}" connected.`);
    });

    client.riffy.on("nodeError", (node, error) => {
      console.log(
        `Node "${node.name}" encountered an error: ${error.message}.`
      );
    });

    client.riffy.on("trackStart", async (player, track) => {
      console.log('trackStart event fired:', {
        guildId: player.guildId,
        trackTitle: track.info.title,
        playing: player.playing,
        paused: player.paused
      });
      const channel = client.channels.cache.get(player.textChannel);
      channel.send(
        `Now playing: \`${track.info.title}\` by \`${track.info.author}\`.`
      );
    });

    client.riffy.on("queueEnd", async (player) => {
      const channel = client.channels.cache.get(player.textChannel);
      const autoplay = false;
      if (autoplay) {
        player.autoplay(player);
      } else {
        player.destroy();
        channel.send("Queue has ended.");
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

    console.log("⏳ Logging into Discord...");
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error(chalk.red.bold("✗ Failed to start bot:"), error);
    process.exit(1);
  }
}

process.on("unhandledRejection", (error) => {
  console.error(chalk.red.bold("✗ Unhandled Promise Rejection:"), error);
});

process.on("uncaughtException", (error) => {
  console.error(chalk.red.bold("✗ Uncaught Exception:"), error);
  process.exit(1);
});

startBot();
