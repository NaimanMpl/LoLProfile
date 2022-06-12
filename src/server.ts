import express, { Application, Request, Response } from 'express';
import { RiotAPI, PlatformId } from '@fightmegg/riot-api';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const RIOT_API_KEY:string = process.env.RIOT_API_KEY!;
const riotApi = new RiotAPI(RIOT_API_KEY);

const app:Application = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/summoner', async (request: Request, response: Response) => {
    // Run Code
    const summoner = await riotApi.summoner.getBySummonerName({
        region: PlatformId.EUW1,
        summonerName: request.body.summonerName
    });
    response.json(summoner);
});

app.post('/summonerRankedStats', async (request: Request, response: Response) => {
    const rankedStats = await riotApi.league.getEntriesBySummonerId({
        region: PlatformId.EUW1,
        summonerId: request.body.summonerId
    });
    response.json(rankedStats);
});

app.listen(3000, () => console.log('Server Started!'));