const fs = require("fs");
const slash = require("../util/slash");

module.exports = {
    event: "ready",
    oneTime: true,
    run: async (client) => {
        const commandFiles = fs.readdirSync("./src/commands");

        client.user.setActivity('live CR matches!', { type: 'WATCHING' });

        let commandsArray = [];
        commandFiles.forEach((file) => {
            const command = require(`../commands/${file}`);
            client.commands.set(command.data.name, command);

            commandsArray.push(command);
        });

        const finalArray = commandsArray.map((e) => e.data);
        slash.register(client.user.id, finalArray);
        console.log(`${client.user.tag} Started`);
    },
};
