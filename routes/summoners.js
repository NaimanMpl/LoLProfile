const express = require('express');
const riotapi = require('@fightmegg/riot-api');
const router = express.Router();

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const riotApi = new riotapi.RiotAPI(RIOT_API_KEY);

router
    .route('/:summonerName')
    .get((req, res) => {
        res.render('summoners/summoner', {
            summoner: req.summoner,
            soloRankedStats: req.soloRankedStats,
            flexRankedStats: req.flexRankedStats,
            profileIconUrl: req.profileIconUrl
        });
    });

router.param('summonerName', async (req, res, next, summonerName) => {
    try {
        // Get Summoner Account Details
        
        const summoner = await riotApi.summoner.getBySummonerName({
            region: riotapi.PlatformId.EUW1,
            summonerName: summonerName
        });
        req.summoner = summoner;

        // Get Summoner's Icon Image Url
        const ddragon = new riotapi.DDragon();
        const ppId = summoner.profileIconId.toString();
        const version = await ddragon.versions.latest();
        const profileIconUrl = `http://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${ppId}.png`
        req.profileIconUrl = profileIconUrl;

        // Get Summoner's Ranked Stats
        const rankedStats = await riotApi.league.getEntriesBySummonerId({
            region: riotapi.PlatformId.EUW1,
            summonerId: summoner.id
        });
        const soloRankedStats = rankedStats[0];
        const flexRankedStats = rankedStats[1];
        const soloTier = soloRankedStats.tier;
        const soloRank = soloRankedStats.rank;
        const flexTier = flexRankedStats.tier;
        const flexRank = flexRankedStats.rank;
        const soloLP = soloRankedStats.leaguePoints;
        const flexLP = flexRankedStats.leaguePoints;
        const dico = {
            'BRONZE' : 'Bronze',
            'SILVER': 'Argent',
            'GOLD' : 'Or',
            'PLATINUM' : 'Platine',
            'DIAMOND' : 'Diamant',
            'MASTER' : 'Maître',
            'GRANDMASTER' : 'Grand Maître',
            'CHALLENGER' : 'Challenger'
        }

        const soloQRankedStats = {
            tier: dico[soloTier],
            rank: soloRank,
            leaguePoints: soloLP,
            imgUrl: `/img/ranks-icons/${soloTier.toLowerCase()}.webp`
        }
        const flexQRankedStats = {
            tier: dico[flexTier],
            rank: flexRank,
            leaguePoints: flexLP,
            imgUrl: `/img/ranks-icons/${flexTier.toLowerCase()}.webp`
        }
        req.soloRankedStats = soloQRankedStats;
        req.flexRankedStats = flexQRankedStats;
        
    } catch (e) {
        console.log(e);
    }
    next();
})

module.exports = router;