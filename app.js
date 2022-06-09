var RiotAPI = require('@fightmegg/riot-api');

(async () => {
    const rAPI = new RiotAPI('RGAPI-d74afddd-72eb-439a-854f-e4ccce12e0a4');
    const summoner = await rAPI.summoner.getBySummonerName({
        region: PlatformId.EUW1,
        summonerName: "ZelphiiX"
    });
    console.log(summoner);
})()