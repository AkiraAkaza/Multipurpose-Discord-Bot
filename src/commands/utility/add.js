const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

// Danh sách người dùng được phép dùng lệnh
const ALLOWED_USERS = [
  "1193190641811849268",
  "921214505797689436"
];

// Danh sách rank
const ROLES = {
  1: "1409189045501694103",
  2: "1409395274828349440",
  3: "1410201774798934100",
  4: "1419331748562731118",
  5: "1419332158215946342"
};

module.exports = {
  category: "Utility",
  name: "add",
  description: "Add rank cho người dùng!",
  slashOnly: false, // chỉ prefix

  // để handler không lỗi
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add role (prefix only)"),

    // Prefix command execution
    async executePrefix(message, args, client) {
        try {
        if (!ALLOWED_USERS.includes(message.author.id)) {
            return message.reply("Bạn không có quyền sử dụng lệnh này!");
        }

        if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return message.reply("Bạn không có quyền quản lý role!");
        }

        if (args.length < 2) {
            return message.reply("Sai cú pháp lệnh!");
        }

        const member = message.mentions.members.first();
        if (!member) {
            return message.reply("Vui lòng tag người dùng hợp lệ!");
        }

        const roleNumber = Number(args[1]);
        if (!Number.isInteger(roleNumber) || roleNumber < 1 || roleNumber > 5) {
            return message.reply("Rank không hợp lệ!");
        }

        const roleId = ROLES[roleNumber];
        const role = message.guild.roles.cache.get(roleId);

        if (!role) {
            return message.reply(`Không tìm thấy role số ${roleNumber}!`);
        }

        if (member.roles.cache.has(role.id)) {
            return message.reply(`${member.user.tag} đã có rank **${role.name}** rồi!`);
        }

        const botMember = await message.guild.members.fetchMe();

        if (botMember.roles.highest.position <= role.position) {
            return message.reply("Role của bot phải cao hơn role cần add!");
        }

        await member.roles.add(role);
        return message.reply(`Đã add rank **${role.name}** cho **${member.user.tag}**`);

        } catch (err) {
        console.error("ADD ROLE ERROR:", err);
        return message.reply("Đã có lỗi xảy ra khi add rank!");
        }
    },

    // Slash command execution
    async executeSlash(interaction) {
        return interaction.reply({
        content: "Lệnh này chỉ hỗ trợ prefix `.add`",
        ephemeral: true
        });
    }
};
