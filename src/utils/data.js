const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/botbanLogs.json");

function loadData() {
    let defaultData = { bannedUsers: {} };

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 4));
        return defaultData;
    }

    try {
        const raw = fs.readFileSync(filePath, "utf8");
        const parsed = JSON.parse(raw || "{}");

        if (!parsed.bannedUsers) parsed.bannedUsers = {};

        return parsed;
    } catch {
        fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 4));
        return defaultData;
    }
}

function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
    } catch (err) {
        console.error("Failed saving JSON:", err);
    }
}

module.exports = { loadData, saveData };