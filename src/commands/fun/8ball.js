const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  category: 'Fun',
  name: '8ball',
  description: 'Hỏi quả cầu thần kỳ một câu hỏi',
  slashOnly: false,
  
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Hỏi quả cầu thần kỳ một câu hỏi')
    .addStringOption(option => 
      option.setName('question')
        .setDescription('Câu hỏi của bạn cho quả cầu')
        .setRequired(true)),

  async executePrefix(message, args, client) {
    const question = args.join(' ');
    if (!question) {
      return message.reply({ content: 'Vui lòng đặt một câu hỏi!', flags: [64] });
    }

    const responses = [
      'Chắc chắn rồi.',
      'Chắc chắn là vậy.',
      'Không có gì để nghi ngờ.',
      'Có - chắc chắn.',
      'Bạn có thể tin tưởng vào nó.',
      'Theo như tôi thấy thì có.',
      'Rất có khả năng.',
      'Triển vọng tốt.',
      'Có.',
      'Dấu hiệu chỉ về có.',
      'Câu trả lời mơ hồ, thử lại sau.',
      'Hỏi lại sau.',
      'Tốt hơn là không nên nói với bạn lúc này.',
      'Không thể dự đoán được bây giờ.',
      'Tập trung và hỏi lại.',
      'Đừng tính vào nó.',
      'Câu trả lời của tôi là không.',
      'Các nguồn của tôi nói không.',
      'Triển vọng không tốt lắm.',
      'Rất đáng nghi ngờ.'
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = {
      color: 0x9B59B6,
      title: '🎱 Quả Cầu Thần Kỳ',
      description: `**Câu hỏi:** ${question}\n\n**Câu trả lời:** ${response}`,
      timestamp: new Date().toISOString()
    };

    await message.reply({ embeds: [embed] });
  },

  async executeSlash(interaction) {
    const question = interaction.options.getString('question');

    const responses = [
      'Chắc chắn rồi.',
      'Chắc chắn là vậy.',
      'Không có gì để nghi ngờ.',
      'Có - chắc chắn.',
      'Bạn có thể tin tưởng vào nó.',
      'Theo như tôi thấy thì có.',
      'Rất có khả năng.',
      'Triển vọng tốt.',
      'Có.',
      'Dấu hiệu chỉ về có.',
      'Câu trả lời mơ hồ, thử lại sau.',
      'Hỏi lại sau.',
      'Tốt hơn là không nên nói với bạn lúc này.',
      'Không thể dự đoán được bây giờ.',
      'Tập trung và hỏi lại.',
      'Đừng tính vào nó.',
      'Câu trả lời của tôi là không.',
      'Các nguồn của tôi nói không.',
      'Triển vọng không tốt lắm.',
      'Rất đáng nghi ngờ.'
    ];

    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = {
      color: 0x9B59B6,
      title: '🎱 Quả Cầu Thần Kỳ',
      description: `**Câu hỏi:** ${question}\n\n**Câu trả lời:** ${response}`,
      timestamp: new Date().toISOString()
    };

    await interaction.reply({ embeds: [embed] });
  }
};