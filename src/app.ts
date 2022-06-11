import { readFileSync } from 'fs';
import { join } from 'path';
import { RiotAPI, PlatformId } from '@fightmegg/riot-api';


function syncReadFile(filename: string): string {
    const result = readFileSync(join(__dirname, filename), 'utf-8');
    return result;
}

const API_KEY: string = syncReadFile('../api_key.txt');

const rAPI = new RiotAPI(API_KEY);
rAPI.summoner.getBySummonerName({
    region: PlatformId.EUW1,
    summonerName: 'ZelphiiX'
}).then(summoner => {console.log(summoner)});



