const fs = require('fs');
const path = require('path');
const riotapi = require('@fightmegg/riot-api');


function syncReadFile(filename: string): string {
    const result = fs.readFileSync(path.join(__dirname, filename), 'utf-8');
    return result;
}

const API_KEY: string = syncReadFile('../src/key.txt');

(async () => {
    const rAPI = new riotapi.RiotAPI(API_KEY);
    const summoner = await rAPI.summoner.getBySummonerName({
        region: riotapi.PlatformId.EUW1,
        summonerName: 'ZelphiiX'
    });
    console.log(summoner);
});
console.log('There');