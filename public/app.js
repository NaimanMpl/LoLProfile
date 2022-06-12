"use strict";
const summonerInput = document.getElementById('search-player-input');
const summonerName = document.getElementById('player-username');
const summonerIcon = document.getElementById('player-summoner-icon');
const summonerFlexRank = document.getElementById('player-flex-rank');
const summonerFlexImg = document.getElementById('player-flex-rank-icon');
const summonerSoloRank = document.getElementById('player-soloduo-rank');
const summonerSoloImg = document.getElementById('player-soloduo-rank-icon');
const recentChampsContainer = document.querySelector('.recent-champ-container');
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
    const iconResponse = await fetch('/summonerProfileIconImg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ summonerName: summonerName })
    });
    const iconData = await iconResponse.json();
    summonerIcon.src = iconData.url;
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
function count(x, array) {
    let i = 0;
    for (let element of array) {
        if (element === x) {
            i++;
        }
    }
    return i;
}
function checkDuplicate(champName, recentChampsRate) {
    for (let c of recentChampsRate) {
        if (c.championName === champName)
            return true;
    }
    return false;
}
function createRecentChampCard(championName, championRate) {
    const recentChampDiv = document.createElement('div');
    recentChampDiv.className = 'recent-champ';
    const recentChampImg = document.createElement('img');
    recentChampImg.src = `http://ddragon.leagueoflegends.com/cdn/12.11.1/img/champion/${championName}.png`;
    recentChampImg.alt = championName;
    const rateText = document.createElement('h3');
    rateText.textContent = (championRate * 100).toString();
    const pourcentSpan = document.createElement('span');
    pourcentSpan.textContent = '%';
    rateText.append(pourcentSpan);
    recentChampDiv.append(recentChampImg);
    recentChampDiv.append(rateText);
    recentChampsContainer.append(recentChampDiv);
}
async function createMatchHistoryCard(match) {
    const matchHistoryCard = document.createElement('div');
    matchHistoryCard.className = 'match-history-card';
    const header = document.createElement('div');
    header.className = 'match-history-card-header';
    const headerLeftCol = document.createElement('div');
    headerLeftCol.className = 'match-history-card-header-left-col';
    const matchType = document.createElement('div');
    matchType.className = 'match-type';
    const queueResponse = await fetch('/queues', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });
    const queueData = await queueResponse.json();
    for (let queue of queueData) {
        if (queue.queueId === match.info.queueId) {
            console.log(queue.map, queue.description);
            break;
        }
    }
}
async function updateMatchHistory(puuid) {
    const response = await fetch('/summonerMatchHistory', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ summonerPuuid: puuid })
    });
    const matchHistory = await response.json();
    const recentChamps = [];
    for (let match of matchHistory) {
        const j = match.metadata.participants.indexOf(puuid);
        const champName = match.info.participants[j].championName;
        recentChamps.push(champName);
    }
    const recentChampsRate = [];
    while (recentChampsContainer.firstChild)
        recentChampsContainer.removeChild(recentChampsContainer.firstChild);
    for (let champName of recentChamps) {
        let rate = count(champName, recentChamps) / recentChamps.length;
        if (checkDuplicate(champName, recentChampsRate))
            continue;
        recentChampsRate.push({
            championName: champName,
            championRate: rate
        });
    }
    recentChampsRate.sort((a, b) => (a.championRate < b.championRate ? 1 : -1));
    let n = recentChampsRate.length < 3 ? recentChamps.length : 3;
    for (let i = 0; i < n; i++) {
        let champ = recentChampsRate[i];
        createRecentChampCard(champ.championName, champ.championRate);
    }
    for (let match of matchHistory) {
        createMatchHistoryCard(match);
    }
}
function updateDisplay() {
    summonerName.textContent = summoner.name;
    updateRankedStats(summoner.id);
    updateMatchHistory(summoner.puuid);
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