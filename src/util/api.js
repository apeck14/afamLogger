const axios = require("axios");
const { formatTag } = require("./functions");

module.exports = {
    getPlayer: async tag => {
        tag = formatTag(tag);
        const url = `https://proxy.royaleapi.dev/v1/players/%23${tag.substr(1)}`;
        const req = await axios.get(url, { headers: { Authorization: 'Bearer ' + process.env.API_TOKEN } });

        return req?.data || req;
    },
    getBattleLog: async tag => {
        tag = formatTag(tag);
        const url = `https://proxy.royaleapi.dev/v1/players/%23${tag.substr(1)}/battlelog`;
        const req = await axios.get(url, { headers: { Authorization: 'Bearer ' + process.env.API_TOKEN } });

        return req?.data || req;
    },
    getClan: async tag => {
        tag = formatTag(tag);
        const url = `https://proxy.royaleapi.dev/v1/clans/%23${tag.substr(1)}`;
        const req = await axios.get(url, { headers: { Authorization: 'Bearer ' + process.env.API_TOKEN } });

        return req?.data || req;
    },
    getRiverRaceLog: () => { },
    getRiverRace: async tag => {
        tag = formatTag(tag);
        const url = `https://proxy.royaleapi.dev/v1/clans/%23${tag.substr(1)}/currentriverrace`;
        const req = await axios.get(url, { headers: { Authorization: 'Bearer ' + process.env.API_TOKEN } });

        return req?.data || req;
    },
    getGlobalWarLeaderboard: async (limit = 100) => {
        const url = `https://proxy.royaleapi.dev/v1/locations/global/rankings/clanwars/?limit=${limit}`;
        const req = await axios.get(url, { headers: { Authorization: 'Bearer ' + process.env.API_TOKEN } });

        return req?.data?.items || req;
    }
}