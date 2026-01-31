const { SlashCommandBuilder } = require("discord.js");

const replyMedia = `### Điều kiện để có media:
### 1. Đăng video tiktok trên 5k view (ít nhất 2 video)
### 2. Live tiktok cho server:
- Điều kiện:
- Bắt buộc để ip server trên phiên live
- Live ít nhất 3 buổi để nhận media
- Yêu cầu mỗi lần live phải gửi link vào discord server để staff hoặc admin check
- Khi đã có media nhưng ngừng live sẽ mất rank
- Trung bình cần 8-12 view xem`;

module.exports = {
  category: "Utility",
  name: "media",
  description: "Điều kiện để nhận media",
  slashOnly: false,

  // Slash command data
  data: new SlashCommandBuilder()
    .setName("media")
    .setDescription("Xem điều kiện để nhận media"),

  // Prefix command execution
  async executePrefix(message, args, client) {
    return message.reply(replyMedia);
  },

  // Slash command execution
  async executeSlash(interaction) {
    return interaction.reply(replyMedia);
  }
};