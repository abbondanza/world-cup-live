const getGoalMsg = (team) => {
    let teamName = team.TeamName[0].Description;
    let goal = team.Goals[team.Goals.length - 1];
    let player =  team.Players
                    .filter((player) => player.IdPlayer === goal.IdPlayer)
                    .map((player) => player.PlayerName[0].Description);
    
    return [`GOOOALL!! ${teamName}!!`, `By ${player} (${goal.Minute})`];   
}

module.exports.buildMsg = (action, match) => {
    let homeTeamName = match.HomeTeam.TeamName[0].Description;
    let awayTeamName = match.AwayTeam.TeamName[0].Description;
    
    const score = `${homeTeamName} ${match.HomeTeam.Score}x${match.AwayTeam.Score} ${awayTeamName}`;
    
    let msg = [];
    
    switch(action) {
        case 'AWAY_GOAL':
            msg = getGoalMsg(match.AwayTeam);
            break;
        case 'HOME_GOAL':
            msg = getGoalMsg(match.HomeTeam);
            break;
        case 'HALF_TIME':
            msg =  [`Half-time`]
            break;
        case 'SECOND_HALF':
            msg =  [`Second half started!`]
            break;
        case 'FULL_TIME':
            msg =  [`Game over!`]
            break;
        case 'GAME_STARTED':
            msg =  [`Game on!`]
            break;
        default:
            msg = null;
            break;
    }
    
    if(!msg)  return false;
    
    msg.push(score);
    return msg.join('\n');
}

module.exports.getAction = (match, oldMatch) => {
    if(match && !oldMatch) {
        if(match.MatchStatus === 3) {
            return 'GAME_STARTED';
        }
        return null;
    }
    
    if(oldMatch.MatchStatus !== 3 && match.MatchStatus === 3) {
        return 'GAME_STARTED';
    }

    if(oldMatch.HomeTeam.Score !== match.HomeTeam.Score) {
        return 'HOME_GOAL';
    }
    
    if(oldMatch.AwayTeam.Score !== match.AwayTeam.Score) {
        return 'AWAY_GOAL';
    }
    
    if(oldMatch.Period === 4 && match.Period !== 4) {
        return 'SECOND_HALF';
    }
    
    //matchData.Period === 10 || matchData.MatchStatus == 0
    if(oldMatch.Period !== 10 && match.Period === 10) {
        return 'FULL_TIME';
    }
    
    if(oldMatch.Period !== 4 && match.Period === 4) {
        return 'HALF_TIME';
    }
    
    if(oldMatch.Period !== 6 && match.Period === 6) {
        return 'EXTRA_TIME';
    }
    
    if(oldMatch.Period !== 8 && match.Period === 8) {
        return 'EXTRA_HALF_TIME';
    }
    
    if(oldMatch.Period !== 11 && match.Period === 11) {
        return 'PENALTY_SHOOTOUT';
    }

    return null;
}