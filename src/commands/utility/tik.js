const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const axios = require('axios');

module.exports = {
  category: 'Utility',
  name: 'tiktok',
  description: 'TikTok Media Preview',
  slashOnly: false,

  data: new SlashCommandBuilder()
    .setName('media')
    .setDescription('Hiển thị thông tin video TikTok')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Link video')
        .setRequired(true)
    ),

  async executePrefix(message, args) {
    const url = args[0];
    if (!url) return message.reply('Vui lòng nhập link video!');
    await handleMedia(url, message);
  },

  async executeSlash(interaction) {
    const url = interaction.options.getString('url');
    await interaction.deferReply();
    await handleMedia(url, interaction);
  }
};


// ================= CORE =================
async function handleMedia(url, target) {

  if (url.includes('tiktok.com')) {
    return handleTikTok(url, target);
  }

  return sendReply(target, 'Hiện chỉ hỗ trợ TikTok. YouTube & Facebook sẽ sớm có!');
}


// ================= TIKTOK HANDLER =================
async function handleTikTok(url, target) {
  try {
    const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    if (!res.data?.data) {
      return sendReply(target, 'Không thể lấy dữ liệu TikTok!');
    }

    const d = res.data.data;

    const title = d.title || 'Không có tiêu đề';
    const author = d.author?.nickname || 'Unknown';
    const avatar = d.author?.avatar || null;
    const verified = d.author?.verified || false;
    const hashtags = (title.match(/#\w+/g) || []).join(' ') || 'Không có';

    const musicTitle = d.music_info?.title || 'Không rõ';
    const musicAuthor = d.music_info?.author || 'Unknown';
    const musicLink = d.music_info?.play || null;
    
    const stats = {
      views: formatNumber(d.play_count),
      likes: formatNumber(d.digg_count),
      comments: formatNumber(d.comment_count),
      shares: formatNumber(d.share_count)
    };

    const themeColor = 0xff0050; // TikTok pink

    // ===== EMBED PRO =====
    const embed = new EmbedBuilder()
      .setColor(themeColor)
      .setTitle('TikTok Video')
      .setURL(url)
      .setAuthor({
        name: verified ? `${author} ✅ VERIFIED` : author,
        iconURL: avatar || undefined
      })
      .setDescription(`📌 **${title}**`)
      .setThumbnail(d.cover || null)
      .addFields(
        { name: '👤 Creator', value: author, inline: true },
        { name: '🏷 Hashtags', value: hashtags, inline: true },
        { name: '🎵 Music', value: `${musicTitle} by ${musicAuthor}`, inline: false },

        { name: '👁 Views', value: stats.views, inline: true },
        { name: '❤️ Likes', value: stats.likes, inline: true },
        { name: '💬 Comments', value: stats.comments, inline: true },
        { name: '🔁 Shares', value: stats.shares, inline: true }
      )
      .setImage(d.cover || null)
      .setFooter({
        text: 'Tiktok Media Preview',
        iconURL: avatar || undefined
      })
      .setTimestamp();

    // ===== BUTTONS =====
    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel('Download Video')
            .setStyle(ButtonStyle.Link)
            .setURL(d.play),

        new ButtonBuilder()
            .setLabel('🎵 Open Music')
            .setStyle(ButtonStyle.Link)
            .setURL(musicLink || url),

        new ButtonBuilder()
            .setLabel('Open TikTok')
            .setStyle(ButtonStyle.Link)
            .setURL(url)
    );

    return sendReply(target, { embeds: [embed], components: [row] });

  } catch (err) {
    console.error('[MEDIA ERROR]', err);
    return sendReply(target, 'Lỗi xử lý TikTok API!');
  }
}


// ================= UTILS =================
function formatNumber(n) {
  if (!n) return '0';
  return Intl.NumberFormat('en').format(n);
}

async function sendReply(target, payload) {
  if (target.reply) return target.reply(payload);
  return target.followUp(payload);
}