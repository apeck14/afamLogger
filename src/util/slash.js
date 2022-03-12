const { guildId, clientId } = require("../../config");

const slash = {
    register: async (clientId, commands) => {
        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v9");

        const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
            return console.log(`Loaded Guild Slash Commands`);
        } catch (error) {
            return console.log(`Could not load Slash Commands: \n ${error}`);
        }
    },
};

module.exports = slash;
