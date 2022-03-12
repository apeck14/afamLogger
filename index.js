const fs = require("fs");
const { schedule } = require("node-cron");
const mongo = require("./src/util/mongo");
mongo.init();

const { Client, Collection, Intents } = require("discord.js");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.commands = new Collection();

const events = fs.readdirSync("./src/events");

events.forEach((event) => {
    const eventFile = require(`./src/events/${event}`);
    if (eventFile.once) {
        client.once(eventFile.event, (...args) => eventFile.run(client, mongo.db, ...args));
    } else {
        client.on(eventFile.event, (...args) => eventFile.run(client, mongo.db, ...args));
    }
});

const jobs = fs.readdirSync('./src/jobs');

for (const job of jobs) { //start all cron jobs
    try {
        require.resolve(`./src/jobs/${job}`); //make sure module exists before requiring
        const jobFile = require(`./src/jobs/${job}`);

        const newJob = schedule(jobFile.expression, () => jobFile.run(client, mongo.db));
        newJob.start();
    } catch (e) {
        console.log(e)
        continue;
    }
}

client.login(process.env.TOKEN);

process.on('unhandledRejection', () => {
    return;
});
