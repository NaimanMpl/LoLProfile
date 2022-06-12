"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const riot_api_1 = require("@fightmegg/riot-api");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const RIOT_API_KEY = process.env.RIOT_API_KEY;
const riotApi = new riot_api_1.RiotAPI(RIOT_API_KEY);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.post('/summoner', async (request, response) => {
    const summoner = await riotApi.summoner.getBySummonerName({
        region: riot_api_1.PlatformId.EUW1,
        summonerName: request.body.summonerName
    });
    response.json(summoner);
});
app.post('/summonerRankedStats', async (request, response) => {
    const rankedStats = await riotApi.league.getEntriesBySummonerId({
        region: riot_api_1.PlatformId.EUW1,
        summonerId: request.body.summonerId
    });
    response.json(rankedStats);
});
app.listen(3000, () => console.log('Server Started!'));
//# sourceMappingURL=server.js.map