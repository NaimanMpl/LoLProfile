import { readFileSync } from "fs";
import { join } from 'path';
import { PlatformId, RiotAPI } from '@fightmegg/riot-api';

function syncReadFile(filename: string): string {
    const result = readFileSync(join(__dirname, filename), 'utf-8');
    return result;
}

const API_KEY = syncReadFile('../src/key.txt');

(async () => {
    const rAPI = new RiotAPI(API_KEY);
    const summoner = await rAPI.summoner.getBySummonerName({
        region: PlatformId.EUW1,
        summonerName: 'ZelphiiX'
    });
    console.log(summoner);
});
