import express, { Application, Request, Response } from 'express';
import { RiotAPI, PlatformId, DDragon, RiotAPITypes } from '@fightmegg/riot-api';
import axios from 'axios';
import queues from './assets/queues.json';
import maps from './assets/maps.json';
import gamemModes from './assets/gameModes.json';


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const RIOT_API_KEY:string = process.env.RIOT_API_KEY!;
const riotApi = new RiotAPI(RIOT_API_KEY);

const app:Application = express();

app.use(express.json());
app.use(express.static('public'));

// Old Methods

app.post('/queues', (request:Request, response:Response) => {
    response.json(queues);
});

app.post('/maps', (request:Request, response:Response) => {
    response.json(maps);
});

app.post('/gameModes', (request:Request, response:Response) => {
    response.json(gamemModes);
});

app.post('/summoner', async (request: Request, response: Response) => {
    // Run Code
    try {
        const summoner = await riotApi.summoner.getBySummonerName({
            region: PlatformId.EUW1,
            summonerName: request.body.summonerName
        });
    
        response.json(summoner);
    } catch (e) {
        console.log(e);
    }
});

app.post('/summonerProfileIconImg', async (request: Request, response: Response) => {
    try {
        const summoner = await riotApi.summoner.getBySummonerName({
            region: PlatformId.EUW1,
            summonerName: request.body.summonerName
        });
        const ddragon = new DDragon();
        const ppId: string = summoner.profileIconId.toString();
        const version: string = await ddragon.versions.latest();
        const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${ppId}.png`
        const icon = await axios.get(profileIconUrl);
    
        response.json(icon.config);
    } catch (e) {
        console.log(e);
    }
});

app.post('/summonerRankedStats', async (request: Request, response: Response) => {
    try {
        const rankedStats = await riotApi.league.getEntriesBySummonerId({
            region: PlatformId.EUW1,
            summonerId: request.body.summonerId
        });
    
        response.json(rankedStats);
    } catch (e) {
        console.log(e);
    }
});

app.post('/summonerMatchHistory', async (request: Request, response: Response) => {
    try {
        const matchHistoryIds = await riotApi.matchV5.getIdsbyPuuid({
            cluster: PlatformId.EUROPE,
            puuid: request.body.summonerPuuid,
            params: {
                start: 0,
                count: 10
            }
        });
        const matchesResponses: Promise<RiotAPITypes.MatchV5.MatchDTO>[] = [];
        matchHistoryIds.forEach( id => {
            let match = riotApi.matchV5.getMatchById({
                cluster: PlatformId.EUROPE,
                matchId: id
            });
            matchesResponses.push(match);
        });
        const matches = await Promise.all(matchesResponses);
        const matchData: RiotAPITypes.MatchV5.MatchDTO[] = [];
        matches.forEach(m => {
            matchData.push(m);
        });
        response.json(matchData);
    } catch(e) {
        console.log(e);
    }
});

app.listen(3000, () => console.log('Server Started!'));