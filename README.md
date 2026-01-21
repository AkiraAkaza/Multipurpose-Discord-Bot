# Discord.js Bot

A feature-rich Discord bot with both slash and prefix commands, MongoDB integration, music playback via Riffy/Lavalink, and clean code structure.

## Features

- ✅ Global Slash Commands
- ✅ Prefix Commands  
- ✅ MongoDB Integration
- ✅ Category-Based Commands
- ✅ Moderation Commands
- ✅ Fun Commands
- ✅ Utility Commands
- ✅ Music Playback (YouTube/Spotify)
- ✅ Voice Channel Integration
- ✅ Clean Code Structure
- ✅ Event Handling
- ✅ Error Handling
- ✅ Colored Console Logs

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Copy `.env` file and fill in your credentials:
   ```
   DISCORD_TOKEN=your_discord_token_here
   MONGODB_URI=your_mongodb_uri_here
   CLIENT_ID=your_client_id_here
   ```

3. **Run the Bot**
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── commands/
│   ├── utility/        # Utility commands (ping, remind)
│   ├── info/           # Information commands (userinfo, serverinfo, avatar, help)
│   ├── moderation/     # Moderation commands (ban, kick, purge, timeout, warn, warnings, slowmode, unban, lock, unlock, nickname, roleinfo)
│   ├── fun/           # Fun commands (8ball, meme, roll)
│   ├── economy/       # Economy commands (balance, work, daily, shop, buy, inventory, transfer, gamble, rob, deposit, withdraw, leaderboard, shopmanage)
│   └── music/         # Music commands (play, skip, stop, queue, volume, loop, nowplaying, lyrics) with Riffy/Lavalink integration
├── events/             # Event handlers
├── models/             # MongoDB models
├── utils/              # Utility functions
└── index.js           # Main bot file with Riffy integration
```

## Available Commands

### Prefix Commands (default: `!`)
- `!ping` - Check bot latency
- `!userinfo` - Get user information
- `!serverinfo` - Get server information
- `!avatar` - Get user's avatar
- `!remind` - Set a reminder
- `!help` - Show all commands
- `!8ball` - Ask magic 8-ball
- `!roll` - Roll a dice
- `!meme` - Get a random meme

**Moderation Commands (require permissions):**
- `!ban` - Ban a user
- `!kick` - Kick a user
- `!purge` - Clean messages with filters (1-100)
- `!timeout` - Timeout a user for specified duration
- `!warn` - Warn a user (stores warnings)
- `!warnings` - Check user warnings
- `!slowmode` - Set channel slowmode (e.g., 5s, 1m, off)
- `!unban` - Unban a user
- `!lock` - Lock channel to prevent messages
- `!unlock` - Unlock channel to allow messages
- `!nickname` - Change user's nickname
- `!roleinfo` - Get role information

**Economy Commands:**
- `!balance` - Check your balance
- `!work` - Work to earn money (1h cooldown)
- `!daily` - Claim daily reward with streak bonus
- `!shop` - View server shop items
- `!buy` - Buy items from shop
- `!inventory` - View your inventory
- `!transfer` - Transfer money to another user
- `!gamble` - Gamble money (dice, coin, slots, number)
- `!rob` - Attempt to rob another user
- `!deposit` - Deposit money to bank (safe from robbing)
- `!withdraw` - Withdraw money from bank
- `!leaderboard` - Show richest users
- `!shopmanage` - Manage shop items (Admin only)

**Music Commands (requires voice channel):**
- `!play` - Play a song from YouTube/Spotify or add to queue
- `!skip` - Skip current song (or multiple songs at once)
- `!stop` - Stop music and clear queue
- `!queue` - Show current music queue with pagination and duration
- `!volume` - Adjust music volume (0-100%) or check current volume
- `!loop` - Toggle loop modes (queue, song, off)
- `!nowplaying` - Show currently playing song with progress bar and duration
- `!lyrics` - Get lyrics for current song

### Slash Commands
- `/ping` - Check bot latency
- `/userinfo` - Get user information
- `/serverinfo` - Get server information
- `/avatar` - Get user's avatar
- `/remind` - Set a reminder
- `/help` - Show all commands (with category filter)
- `/8ball` - Ask magic 8-ball
- `/roll` - Roll a dice
- `/meme` - Get a random meme

**Moderation Commands (require permissions):**
- `/ban` - Ban a user
- `/kick` - Kick a user
- `/purge` - Clean messages with filters (1-100)
- `/timeout` - Timeout a user for specified duration
- `/warn` - Warn a user (stores warnings)
- `/warnings` - Check user warnings
- `/slowmode` - Set channel slowmode (e.g., 5s, 1m, off)
- `/unban` - Unban a user
- `/lock` - Lock channel to prevent messages
- `/unlock` - Unlock channel to allow messages
- `/nickname` - Change user's nickname
- `/roleinfo` - Get role information

**Music Commands (requires voice channel):**
- `/play` - Play a song from YouTube/Spotify or add to queue
- `/skip` - Skip current song (or multiple songs at once)
- `/stop` - Stop music and clear queue
- `/queue` - Show current music queue with pagination and duration
- `/volume` - Adjust music volume (0-100%) or check current volume
- `/loop` - Toggle loop modes (queue, song, off)
- `/nowplaying` - Show currently playing song with progress bar and duration
- `/lyrics` - Get lyrics for current song

### Command Categories
- **Utility**: General purpose commands
- **Info**: Information about users, servers, etc.
- **Moderation**: Server moderation tools
- **Fun**: Entertainment commands
- **Music**: Audio playback with YouTube/Spotify support via Riffy/Lavalink

## Adding New Commands

Create a new file in `src/commands/[category]/`:
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'CategoryName',
  name: 'commandname',
  description: 'Command description',
  slashOnly: false, // Set to true if only slash command
  
  // Slash command data
  data: new SlashCommandBuilder()
    .setName('commandname')
    .setDescription('Command description')
    .addStringOption(option => 
      option.setName('option')
        .setDescription('Option description')
        .setRequired(false)),

  // Prefix command execution
  async executePrefix(message, args, client) {
    // Your prefix command logic here
    await message.reply('This is the prefix command!');
  },

  // Slash command execution
  async executeSlash(interaction) {
    // Your slash command logic here
    await interaction.reply('This is the slash command!');
  }
};
```

## Important Notes

- **Global Commands**: This bot uses global slash commands which may take up to 1 hour to propagate across all servers
- **Permissions**: Moderation commands require appropriate Discord permissions
- **Categories**: Create new folders in `src/commands/` for new categories
- **Music System**: Powered by Riffy/Lavalark for high-quality audio streaming
- **Voice Requirements**: Music commands require bot to have proper voice channel permissions
- **Dependencies**: Requires Lavalark server connection for music functionality

## MongoDB Models

The bot includes models for:
- **Guild** - Server-specific data and configuration
- **User** - User-specific data including economy and warnings

### Music System
- **Riffy Integration**: Uses Riffy library for Lavalark connectivity
- **YouTube/Spotify Support**: Search and play from multiple platforms
- **Queue Management**: Advanced queue system with pagination
- **Duration Formatting**: Human-readable time display (MM:SS, HH:MM:SS)
- **Volume Control**: Adjustable audio levels with real-time feedback
- **Loop Modes**: Song, queue, and loop-off functionality

You can extend these models or create new ones in `src/models/`.
