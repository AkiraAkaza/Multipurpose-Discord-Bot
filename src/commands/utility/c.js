const { SlashCommandBuilder } = require("discord.js");

const replyCard = `
### 📢 LƯU Ý KHI MUA RANK BẰNG THẺ CÀO

Khi mua rank bằng thẻ cào, hãy điền đầy đủ thông tin theo mẫu sau:

Loại thẻ:
Seri:
Mã thẻ:
Ingame:
Mua rank:

📌 Ví dụ:

Loại thẻ: Viettel
Seri: 9999999
Mã thẻ: 9999999
Ingame: admin123
Mua rank: Vietx

⚠️ Lưu ý:

- Kiểm tra kỹ Seri và Mã thẻ trước khi gửi.
- Điền đúng tên ingame để tránh cấp nhầm rank.
- Thẻ đã gửi sẽ không thể hoàn lại nếu nhập sai thông tin.

Cảm ơn bạn đã ủng hộ server ❤️`;

module.exports = {
  category: "Utility",
  name: "c",
  description: "Cách mua bằng card",
  slashOnly: false,

  // Slash command data
  data: new SlashCommandBuilder()
    .setName("card")
    .setDescription("Cách mua bằng card"),

  // Prefix command execution
  async executePrefix(message, args, client) {
    return message.reply(replyCard);
  },

  // Slash command execution
  async executeSlash(interaction) {
    return interaction.reply(replyKey);
  }
};
