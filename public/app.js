"use strict";
const summonerInput = document.getElementById('search-player-input');
const summonerName = document.getElementById('player-username');
const summonerFlexRank = document.getElementById('player-flex-rank');
const summonerFlexImg = document.getElementById('player-flex-rank-icon');
const summonerSoloRank = document.getElementById('player-soloduo-rank');
const summonerSoloImg = document.getElementById('player-soloduo-rank-icon');
const summoner = {
    id: "HUGj8oTqhurjVWr5bkmQB1Tun-oLKAltyU4d4HJyHGVd12O8",
    accountId: "P7olNCQiuJFMBS1-J2V3MBcg47BOdeLWP9sibl7kmOaQkSY",
    puuid: "B__F7pqQDd5j3PPJatHdZIJlySmSGLHIOF9F17nZ-FZZoJZkitS7UrHomaP---gEqm2UKv57O3GIPA",
    name: "ZelphiiX",
    profileIconId: 5021,
    revisionDate: 1654958033000,
    summonerLevel: 336
};
async function getSummoner(summonerName) {
    const response = await fetch('/summoner', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ summonerName: summonerName })
    });
    const summonerData = await response.json();
    summoner['id'] = summonerData['id'];
    summoner['accountId'] = summonerData['accountId'];
    summoner['puuid'] = summonerData['puuid'];
    summoner['name'] = summonerData['name'];
    summoner['profileIconId'] = summonerData['profileIconId'];
    summoner['revisionDate'] = summonerData['revisionDate'];
    summoner['summonerLevel'] = summonerData['summonerLevel'];
    updateDisplay();
}
async function updateRankedStats(summonerId) {
    const response = await fetch('/summonerRankedStats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ summonerId: summonerId })
    });
    const rankedStats = await response.json();
    const rankedSoloStats = rankedStats[0];
    const rankedFlexStats = rankedStats[1];
    const dico = {
        'BRONZE': 'Bronze',
        'SILVER': 'Argent',
        'GOLD': 'Or',
        'PLATINIUM': 'Platine',
        'DIAMOND': 'Diamant',
        'MASTER': 'Maître',
        'GRANDMASTER': 'Grand Maître',
        'CHALLENGER': 'Challenger'
    };
    const soloTier = rankedSoloStats['tier'];
    console.log('SoloTier', soloTier);
    const soloRank = rankedSoloStats['rank'];
    const soloLP = rankedSoloStats['leaguePoints'];
    summonerSoloRank.textContent = `${dico[soloTier]} ${soloRank} - ${soloLP} LP`;
    summonerSoloImg.src = `./img/ranks-icons/${soloTier.toLowerCase()}.webp`;
    const flexTier = rankedFlexStats['tier'];
    const flexRank = rankedFlexStats['rank'];
    const flexLP = rankedFlexStats['leaguePoints'];
    summonerFlexRank.textContent = `${dico[flexTier]} ${flexRank} - ${flexLP} LP`;
    summonerFlexImg.src = `./img/ranks-icons/${flexTier.toLowerCase()}.webp`;
}
function updateDisplay() {
    summonerName.textContent = summoner.name;
    updateRankedStats(summoner.id);
}
summonerInput.addEventListener('keydown', event => {
    if (!summonerInput.value)
        return;
    if (event.key === 'Enter') {
        getSummoner(summonerInput.value);
    }
});
updateDisplay();
//# sourceMappingURL=app.js.map