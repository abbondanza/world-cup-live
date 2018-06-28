const getGoalMsg = (team, opponent) => {
    let teamName = team.TeamName[0].Description;
    let goal = team.Goals[team.Goals.length - 1];
    
    let scoringTeam = team;
    let ownGoal = false;
    if(goal.IdTeam !== team.IdTeam) {
        ownGoal = true;
        scoringTeam = opponent;
    }
    
    let player =  scoringTeam.Players
                    .filter((player) => player.IdPlayer === goal.IdPlayer)
                    .map((player) => player.PlayerName[0].Description);  
                    
    
    
    let msgArr = [`GOOOALL!! ${teamName}!!`];
    if(ownGoal) {
        msgArr.push(`By ${player} (${goal.Minute})`);
    } else {
        msgArr.push(`Own goal by ${player} (${goal.Minute})`);
    }
    
    return msgArr;
}

module.exports.buildMsg = (action, match) => {
    let homeTeamName = match.HomeTeam.TeamName[0].Description;
    let awayTeamName = match.AwayTeam.TeamName[0].Description;
    
    const score = `${homeTeamName} ${match.HomeTeam.Score}x${match.AwayTeam.Score} ${awayTeamName}`;
    const vs = `${homeTeamName} vs. ${awayTeamName}`;
    
    let msg = [];
    
    switch(action) {
        case 'AWAY_GOAL':
            msg = getGoalMsg(match.AwayTeam, match.HomeTeam);
            break;
        case 'HOME_GOAL':
            msg = getGoalMsg(match.HomeTeam, match.AwayTeam);
            break;
        case 'HALF_TIME':
            msg =  [`Half-Time`]
            break;
        case 'SECOND_HALF':
            msg =  [`Start of Second Half`]
            break;
        case 'GAME_OVER':
            msg =  [`Final Whistle!`]
            break;
        case 'FULL_TIME':
            msg =  [`Full-time`]
            break;
        case 'GAME_STARTED':
            msg =  [`The Match has Started!`]
            break;
        default:
            msg = null;
            break;
    }
    
    if(!msg)  return false;
    
    if(action === 'GAME_STARTED') {
        msg.push(vs);
    } else {
       msg.push(score);
    }
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
    
    if(oldMatch.MatchStatus !== 0 && match.MatchStatus === 0) {
        return 'GAME_OVER';
    }

    if(oldMatch.HomeTeam.Score !== match.HomeTeam.Score) {
        return 'HOME_GOAL';
    }
    
    if(oldMatch.AwayTeam.Score !== match.AwayTeam.Score) {
        return 'AWAY_GOAL';
    }
    
    if(oldMatch.Period !== 4 && match.Period === 4) {
        return 'HALF_TIME';
    }

    if(oldMatch.Period === 4 && match.Period !== 4) {
        return 'SECOND_HALF';
    }
    
    if(oldMatch.Period !== 6 && match.Period === 6) {
        return 'EXTRA_TIME';
    }
    
    if(oldMatch.Period !== 8 && match.Period === 8) {
        return 'EXTRA_HALF_TIME';
    }
    
    if(oldMatch.Period === 8 && match.Period !== 8) {
        return 'EXTRA_SECOND_HALF';
    }
    
    if(oldMatch.Period !== 11 && match.Period === 11) {
        return 'PENALTY_SHOOTOUT';
    }

    if(oldMatch.Period !== 10 && match.Period === 10) {
        return 'FULL_TIME';
    }

    return null;
}