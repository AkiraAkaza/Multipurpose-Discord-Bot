const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

const ADMIN_IDS = [
  "1193190641811849268",
  "921214505797689436"
];

module.exports = {
  category: 'utility',
  name: 'napthe',
  description: 'Mua rank bằng thẻ cào',
  slashOnly: true,

  data: new SlashCommandBuilder()
    .setName('napthe')
    .setDescription('Mua rank bằng thẻ cào')

    .addStringOption(option =>
      option.setName('card')
        .setDescription('Loại thẻ')
        .setRequired(true)
        .addChoices(
          { name: 'Viettel', value: 'Viettel' },
          { name: 'Mobifone', value: 'Mobifone' },
          { name: 'Vinaphone', value: 'Vinaphone' },
          { name: 'Vietnamobile', value: 'Vietnamobile' },
          { name: 'Gmobile', value: 'Gmobile' },
          { name: 'iTel', value: 'iTel' },
          { name: 'Garena', value: 'Garena' }
        ))

    .addStringOption(option =>
      option.setName('rank')
        .setDescription('Rank muốn mua')
        .setRequired(true)
        .addChoices(
          { name: 'Rank Viet', value: 'Rank Viet' },
          { name: 'Rank Viet+', value: 'Rank Viet+' },
          { name: 'Rank Viet++', value: 'Rank Viet++' },
          { name: 'Rank VietX', value: 'Rank VietX' },
          { name: 'Rank VietX+', value: 'Rank VietX+' },
          { name: 'Rank Custom', value: 'Rank Custom' }
        ))

    .addStringOption(option =>
      option.setName('seri')
        .setDescription('Seri thẻ')
        .setRequired(true))

    .addStringOption(option =>
      option.setName('mathe')
        .setDescription('Mã thẻ')
        .setRequired(true))

    .addStringOption(option =>
      option.setName('ingame')
        .setDescription('Tên ingame')
        .setRequired(true)),

  async executePrefix(message) {
    await message.reply("❌ Lệnh này chỉ dùng bằng Slash Command `/c`.");
  },

  async executeSlash(interaction) {

    const card = interaction.options.getString("card");
    const rank = interaction.options.getString("rank");
    const seri = interaction.options.getString("seri");
    const mathe = interaction.options.getString("mathe");
    const ingame = interaction.options.getString("ingame");

    const approve = new ButtonBuilder()
      .setCustomId(`approve_${interaction.user.id}`)
      .setLabel("Duyệt")
      .setStyle(ButtonStyle.Success);

    const reject = new ButtonBuilder()
      .setCustomId(`reject_${interaction.user.id}`)
      .setLabel("Từ chối")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(approve, reject);

    const report = `
📢 THÔNG TIN THẺ CÀO

👤 Người gửi: ${interaction.user.tag}
🆔 ID: ${interaction.user.id}

📂 Channel: ${interaction.channel.name}

💳 Loại thẻ: ${card}
Seri: ${seri}
Mã thẻ: ${mathe}

🎮 Ingame: ${ingame}
🎖 Rank: ${rank}
`;

    // thông báo cho user trước
    await interaction.reply({
      content: "⏳ Thông tin thẻ đã gửi. Vui lòng chờ admin duyệt.",
      ephemeral: true
    });

    // gửi DM cho admin
    for (const id of ADMIN_IDS) {
      try {
        const admin = await interaction.client.users.fetch(id);

        await admin.send({
          content: report,
          components: [row]
        });

      } catch (err) {
        console.log("Không gửi được DM tới admin:", id);
      }
    }
  }
};
