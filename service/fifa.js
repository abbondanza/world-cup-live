let reqPromise = require('request-promise');
const BASE_PATH = 'https://api.fifa.com/api/v1/live/football';
const GRP_STG_API = BASE_PATH + '/17/254645';
const RECENT_API = BASE_PATH + '/recent/17/254645';
const LANG = '?language=en-GB';


module.exports.getRecent = () => {
    console.log('recent');
    return new Promise((resolve, reject) => {
        reqPromise({
            url: RECENT_API + LANG,
            method: 'GET',
            json: true
        })
        .then((result) => {
            let matches = result.Results;
            let wcMatches = matches.filter((item) => item.IdCompetition === '17');
            resolve(wcMatches)
        })
        .catch((err) => reject(err));
    });
}

module.exports.getMatch = (matchId, stageId) => {
    stageId = stageId || '275073'; // GROUP STAGE
    return new Promise((resolve, reject) => {
        reqPromise({
            url: GRP_STG_API + '/' + stageId + '/' + matchId + LANG,
            method: 'GET',
            json: true
        })
        .then((result) => {
            resolve(result)
        })
        .catch((err) => reject(err));
    });
}