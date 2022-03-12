module.exports = {
    event: "ready",
    oneTime: true,
    run: async (client) => {
        client.user.setActivity('live CR matches!', { type: 'WATCHING' });

        console.log(`${client.user.tag} Started`);
    },
};
