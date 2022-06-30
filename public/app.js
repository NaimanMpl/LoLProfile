"use strict";
const summonerInput = document.getElementById('search-player-input');
const summonerName = document.getElementById('player-username');
const summonerIcon = document.getElementById('player-summoner-icon');
const summonerFlexRank = document.getElementById('player-flex-rank');
const summonerFlexImg = document.getElementById('player-flex-rank-icon');
const summonerSoloRank = document.getElementById('player-soloduo-rank');
const summonerSoloImg = document.getElementById('player-soloduo-rank-icon');
const recentChampsContainer = document.querySelector('.recent-champ-container');
const matchHistoryContainer = document.querySelector('.match-history-card-container');
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
        'PLATINUM': 'Platine',
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
async function createRecentChampCard(championName, championRate) {
    const recentChampDiv = document.createElement('div');
    recentChampDiv.className = 'recent-champ';
    const recentChampImg = document.createElement('img');
    const response = await fetch('/champSquareImg', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ championName: championName })
    });
    const champSquareImg = await response.json();
    recentChampImg.src = champSquareImg.url;
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
async function createMatchHistoryCard(match, puuid) {
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
            matchType.textContent = `${queue.map} - ${queue.description}`;
            break;
        }
    }
    const matchDateInfo = document.createElement('div');
    matchDateInfo.className = 'match-dateinfo';
    const startTimestamp = match.info.gameStartTimestamp;
    const matchDate = document.createElement('a');
    matchDate.className = 'match-date';
    const matchDuration = document.createElement('a');
    matchDuration.className = 'match-duration';
    const startDate = new Date(startTimestamp);
    if (startDate.getHours() < 10)
        matchDate.textContent = '0';
    matchDate.textContent += startDate.getHours().toString() + ':' + (startDate.getMinutes() < 10 ? '0' + startDate.getMinutes().toString() : startDate.getMinutes().toString());
    matchDuration.textContent = 'In Dev !';
    matchDateInfo.append(matchDate);
    matchDateInfo.append(matchDuration);
    headerLeftCol.append(matchType);
    headerLeftCol.append(matchDateInfo);
    const headerRightCol = document.createElement('div');
    headerRightCol.className = 'match-history-card-header-right-col';
    const matchIssue = document.createElement('a');
    matchIssue.className = 'match-issue';
    const j = match.metadata.participants.indexOf(puuid);
    const win = match.info.participants[j].win;
    matchIssue.textContent = win ? 'Victoire' : 'Défaite';
    if (!win)
        matchIssue.style.backgroundColor = '#C0433F';
    headerRightCol.append(matchIssue);
    header.append(headerLeftCol);
    header.append(headerRightCol);
    matchHistoryCard.append(header);
    const mainContent = document.createElement('div');
    mainContent.className = 'match-history-card-main';
    const mainLeftCol = document.createElement('div');
    mainLeftCol.className = 'match-history-card-main-left-col';
    const champImg = document.createElement('div');
    champImg.className = 'match-history-champ-img';
    const splashResponse = await fetch('/championSplash', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ championName: match.info.participants[j].championName })
    });
    const splashImg = await splashResponse.json();
    champImg.style.background = `url(${splashImg.url})`;
    champImg.style.backgroundSize = 'cover';
    const matchInfos = document.createElement('div');
    matchInfos.className = 'match-history-champ-infos';
    const champLevelDiv = document.createElement('h5');
    champLevelDiv.className = 'match-history-level';
    champLevelDiv.textContent = match.info.participants[j].champLevel.toString();
    const champNameDiv = document.createElement('h5');
    champNameDiv.className = 'match-history-champ-name';
    champNameDiv.textContent = match.info.participants[j].championName;
    matchInfos.append(champLevelDiv);
    matchInfos.append(champNameDiv);
    champImg.append(matchInfos);
    mainLeftCol.append(champImg);
    const mainRightCol = document.createElement('div');
    mainRightCol.className = 'match-history-card-main-right-col';
    const itemsContainer = document.createElement('div');
    itemsContainer.className = 'match-history-items';
    const itemIdArray = [];
    for (let i = 0; i < 6; i++) {
        const itemId = match.info.participants[j][`item${i}`];
        if (itemId !== 0)
            itemIdArray.push(itemId);
    }
    console.log(itemIdArray);
    const itemResponse = await fetch('/item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ itemIds: itemIdArray })
    });
    const itemData = await itemResponse.json();
    for (let i = 0; i < 6; i++) {
        const matchItem = document.createElement('img');
        matchItem.className = 'match-item';
        if (i < itemData.length) {
            const itemUrl = itemData[i];
            matchItem.src = itemUrl;
        }
        else {
            matchItem.src = './img/items/default-item.svg';
        }
        itemsContainer.append(matchItem);
    }
    const matchSummoners = document.createElement('div');
    matchSummoners.className = 'match-history-summoners';
    const summoner1 = document.createElement('img');
    summoner1.src = './img/summoners/flash.webp';
    const summoner2 = document.createElement('img');
    summoner2.src = './img/summoners/heal.webp';
    matchSummoners.append(summoner1);
    matchSummoners.append(summoner2);
    mainRightCol.append(itemsContainer);
    mainRightCol.append(matchSummoners);
    mainContent.append(mainLeftCol);
    mainContent.append(mainRightCol);
    matchHistoryCard.append(mainContent);
    const footer = document.createElement('div');
    footer.className = 'match-history-card-footer';
    const footerImgArray = [
        {
            img: './img/war-swords.svg',
            class: 'match-player-kda',
            text: `${match.info.participants[j].kills}/${match.info.participants[j].deaths}/${match.info.participants[j].assists}`
        },
        {
            img: '',
            class: 'match-player-cs',
            text: `${match.info.participants[j].totalMinionsKilled} CS`
        },
        {
            img: './img/coin.svg',
            class: 'match-player-gold-earn',
            text: `${match.info.participants[j].goldEarned}`
        },
        {
            img: './img/arrow-right.svg'
        }
    ];
    for (let card of footerImgArray) {
        const footerCard = document.createElement('div');
        footerCard.className = 'footer-card';
        if (card.img) {
            const cardImg = document.createElement('img');
            cardImg.src = card.img;
            cardImg.className = 'footer-card-img';
            footerCard.append(cardImg);
        }
        if (card.class) {
            const cardText = document.createElement('h5');
            cardText.className = card.class;
            cardText.textContent = card.text;
            footerCard.append(cardText);
        }
        footer.append(footerCard);
    }
    matchHistoryCard.append(footer);
    matchHistoryContainer.append(matchHistoryCard);
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
    let n = recentChampsRate.length < 3 ? recentChampsRate.length : 3;
    for (let i = 0; i < n; i++) {
        let champ = recentChampsRate[i];
        console.log(champ);
        createRecentChampCard(champ.championName, champ.championRate);
    }
    while (matchHistoryContainer.firstChild)
        matchHistoryContainer.removeChild(matchHistoryContainer.firstChild);
    for (let match of matchHistory) {
        createMatchHistoryCard(match, puuid);
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