"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const riot_api_1 = require("@fightmegg/riot-api");
const axios_1 = __importDefault(require("axios"));
const queues_json_1 = __importDefault(require("./assets/queues.json"));
const maps_json_1 = __importDefault(require("./assets/maps.json"));
const gameModes_json_1 = __importDefault(require("./assets/gameModes.json"));
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const riotApi = new riot_api_1.RiotAPI(RIOT_API_KEY);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use('/css', express_1.default.static(__dirname + 'public/css'));
app.use('/img', express_1.default.static(__dirname + 'public/img'));
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
const summonerRouter = require('../routes/summoners');
app.use('/summoners', summonerRouter);
app.post('/queues', (request, response) => {
    response.json(queues_json_1.default);
});
app.post('/maps', (request, response) => {
    response.json(maps_json_1.default);
});
app.post('/gameModes', (request, response) => {
    response.json(gameModes_json_1.default);
});
app.post('/summoner', async (request, response) => {
    try {
        const summoner = await riotApi.summoner.getBySummonerName({
            region: riot_api_1.PlatformId.EUW1,
            summonerName: request.body.summonerName
        });
        response.json(summoner);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/summonerProfileIconImg', async (request, response) => {
    try {
        const summoner = await riotApi.summoner.getBySummonerName({
            region: riot_api_1.PlatformId.EUW1,
            summonerName: request.body.summonerName
        });
        const ddragon = new riot_api_1.DDragon();
        const ppId = summoner.profileIconId.toString();
        const version = await ddragon.versions.latest();
        const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${ppId}.png`;
        const icon = await axios_1.default.get(profileIconUrl);
        response.json(icon.config);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/summonerRankedStats', async (request, response) => {
    try {
        const rankedStats = await riotApi.league.getEntriesBySummonerId({
            region: riot_api_1.PlatformId.EUW1,
            summonerId: request.body.summonerId
        });
        response.json(rankedStats);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/summonerMatchHistory', async (request, response) => {
    try {
        const matchHistoryIds = await riotApi.matchV5.getIdsbyPuuid({
            cluster: riot_api_1.PlatformId.EUROPE,
            puuid: request.body.summonerPuuid,
            params: {
                start: 0,
                count: 10
            }
        });
        const matchesResponses = [];
        matchHistoryIds.forEach(id => {
            let match = riotApi.matchV5.getMatchById({
                cluster: riot_api_1.PlatformId.EUROPE,
                matchId: id
            });
            matchesResponses.push(match);
        });
        const matches = await Promise.all(matchesResponses);
        const matchData = [];
        matches.forEach(m => {
            matchData.push(m);
        });
        response.json(matchData);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/champSquareImg', async (request, response) => {
    try {
        const ddragon = new riot_api_1.DDragon();
        const version = await ddragon.versions.latest();
        const championName = request.body.championName;
        const champSquareUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
        const champSquareImg = await axios_1.default.get(champSquareUrl);
        response.json(champSquareImg.config);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/championSplash', async (request, response) => {
    try {
        const championName = request.body.championName;
        const championSplashUrl = `http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${championName}_0.jpg`;
        const championSplash = await axios_1.default.get(championSplashUrl);
        response.json(championSplash.config);
    }
    catch (e) {
        console.log(e);
    }
});
app.post('/item', async (request, response) => {
    try {
        const ddragon = new riot_api_1.DDragon();
        const version = await ddragon.versions.latest();
        const itemIdsArray = request.body.itemIds;
        const itemPromises = [];
        itemIdsArray.forEach(id => {
            const itemUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/img/item/${id}.png`;
            itemPromises.push(axios_1.default.get(itemUrl));
        });
        const itemsImg = await Promise.all(itemPromises);
        const itemData = [];
        itemsImg.forEach(item => {
            itemData.push(item.config.url);
        });
        response.json(itemData);
    }
    catch (e) {
        console.log(e);
    }
});
app.listen(3000, () => console.log('Server Started!'));
//# sourceMappingURL=server.js.map