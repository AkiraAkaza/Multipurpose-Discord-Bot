const { SlashCommandBuilder } = require("discord.js");

const replyCard = `### Lưu ý khi mua bằng card:
● Ưu tiên nhận viettel vì thuế thấp nhất chỉ 7% so với các loại card khác là 8-10%
● Từ giờ khi ae mua rank bằng card sẽ giảm 1 số lợi ích (tương đối nhỏ) ví dụ ae sẽ chỉ được nhận 1 thay vì 2 món mà mức rank ae có, có thể là chọn lấy shards hoặc money kiểu vậy
● Mình không khuyến khích ae mua rank bằng card vì mình phải chịu thiệt rất nhiều nếu ae mua 50-100k thì không đáng kể nhưng nếu 200-500k thì mình sẽ lỗ rất lớn vì mình bán rank giá cố định và không tính thuế cho ae, miễn ae vui là đc!`;

module.exports = {
  category: "Utility",
  name: "card",
  description: "Lưu ý khi mua bằng card",
  slashOnly: false,

  // Slash command data
  data: new SlashCommandBuilder()
    .setName("card")
    .setDescription("Lưu ý khi mua bằng card"),

  // Prefix command execution
  async executePrefix(message, args, client) {
    return message.reply(replyCard);
  },

  // Slash command execution
  async executeSlash(interaction) {
    return interaction.reply(replyKey);
  }
};
