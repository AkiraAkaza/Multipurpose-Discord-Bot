const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  category: 'guide',
  name: 'huongdan',
  description: 'Hướng dẫn cách nạp thẻ khi mua rank',
  slashOnly: false,

  data: new SlashCommandBuilder()
    .setName('napthe')
    .setDescription('Hướng dẫn cách nạp khi thẻ mua rank'),

  // PREFIX COMMAND
  async executePrefix(message, args, client) {

    const embed = new EmbedBuilder()
      .setTitle("📢 Hướng dẫn cách nạp thẻ khi mua Rank")
      .setColor("Green")
      .setDescription(`
Để mua **Rank bằng thẻ cào**, hãy làm theo các bước sau:

**Bước 1:** Tạo ticket hỗ trợ  
**Bước 2:** Trong kênh ticket, sử dụng lệnh: `/napthe`
**Bước 3:** Làm theo hướng dẫn của bot:
• Chọn **Loại thẻ**  
• Chọn **Rank muốn mua**  
• Nhập **Seri, Mã thẻ và Ingame**

Sau khi gửi thông tin, hệ thống sẽ hiển thị **trạng thái chờ duyệt**.

👨‍💻 **Admin sẽ kiểm tra thẻ:**

✅ Nếu thẻ hợp lệ → **Rank sẽ được cấp**  
❌ Nếu thẻ sai → **Bạn sẽ nhận thông báo thẻ không hợp lệ**
`)
      .addFields(
        {
          name: "💳 Loại thẻ hỗ trợ",
          value: "Viettel, Mobifone, Vinaphone, Vietnamobile, Gmobile, iTel, Garena"
        },
        {
          name: "🎖 Rank có thể mua",
          value:
          "Rank Viet\n" +
          "Rank Viet+\n" +
          "Rank Viet++\n" +
          "Rank VietX\n" +
          "Rank VietX+\n" +
          "Rank Custom"
        }
      );

    await message.reply({ embeds: [embed] });
  },

  // SLASH COMMAND
  async executeSlash(interaction) {

    const embed = new EmbedBuilder()
      .setTitle("📢 Hướng dẫn cách nạp khi thẻ mua rank")
      .setColor("Green")
      .setDescription(`
Để mua **Rank bằng thẻ cào**, hãy làm theo các bước sau:

**Bước 1:** Tạo ticket hỗ trợ  
**Bước 2:** Trong kênh ticket, sử dụng lệnh: `/napthe`
**Bước 3:** Làm theo hướng dẫn của bot:
• Chọn **Loại thẻ**  
• Chọn **Rank muốn mua**  
• Nhập **Seri, Mã thẻ và Ingame**

Sau khi gửi thông tin, hệ thống sẽ hiển thị **trạng thái chờ duyệt**.

👨‍💻 **Admin sẽ kiểm tra thẻ:**

✅ Nếu thẻ hợp lệ → **Rank sẽ được cấp**  
❌ Nếu thẻ sai → **Bạn sẽ nhận thông báo thẻ không hợp lệ**
`)
      .addFields(
        {
          name: "💳 Loại thẻ hỗ trợ",
          value: "Viettel, Mobifone, Vinaphone, Vietnamobile, Gmobile, iTel, Garena"
        },
        {
          name: "🎖 Rank có thể mua",
          value:
          "Rank Viet\n" +
          "Rank Viet+\n" +
          "Rank Viet++\n" +
          "Rank VietX\n" +
          "Rank VietX+\n" +
          "Rank Custom"
        }
      );

    await interaction.reply({ embeds: [embed] });
  }
};
