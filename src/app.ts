import { RiotAPI, PlatformId } from '@fightmegg/riot-api';

// const API_KEY: string = readFileSync(join(__dirname, '../key.txt'), 'utf-8');
const API_KEY = 'RGAPI-68fb2b40-6509-46b2-b99f-41d9e538a62b';
const rAPI = new RiotAPI(API_KEY);

rAPI.summoner.getBySummonerName({
    region: PlatformId.EUW1,
    summonerName: 'ZelphiiX'
}).then(() => { console.log('Hi!') }).catch(() => { console.log('There!'); });
console.log('Hello World!');