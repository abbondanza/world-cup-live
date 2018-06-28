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
    if(!ownGoal) {
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

module.exports.getActions = (match, oldMatch) => {
    let results = [];
    if(match && !oldMatch) {
        if(match.MatchStatus === 3) {
            results.push('GAME_STARTED');
        }
        return results;
    }
    
    let gameOver = false;
    if(oldMatch.MatchStatus !== match.MatchStatus) {
        if(oldMatch.MatchStatus !== 3 && match.MatchStatus === 3) {
            results.push('GAME_STARTED');
        } else if(oldMatch.MatchStatus !== 0 && match.MatchStatus === 0) {
            gameOver = true;
            results.push('GAME_OVER');
        } else {
            results.push('UNHANDLED_STATUS');
        }
    }
    
    if(oldMatch.Period !== match.Period) {
        if(oldMatch.Period !== 4 && match.Period === 4) {
            results.push('HALF_TIME');
        } else if(oldMatch.Period === 4 && match.Period !== 4) {
            results.push('SECOND_HALF');
        } else if(oldMatch.Period !== 6 && match.Period === 6) {
            results.push('EXTRA_TIME');
        } else if(oldMatch.Period !== 8 && match.Period === 8) {
            results.push('EXTRA_HALF_TIME');
        } else if(oldMatch.Period === 8 && match.Period !== 8) {
            results.push('EXTRA_SECOND_HALF');
        } else if(oldMatch.Period !== 11 && match.Period === 11) {
            results.push('PENALTY_SHOOTOUT');
        } else if(oldMatch.Period !== 10 && match.Period === 10 && !gameOver) {
            results.push('FULL_TIME');
        } else {
            results.push('UNHANDLED_PERIOD');
        }

    }

    if(oldMatch.HomeTeam.Score !== match.HomeTeam.Score) {
        results.push('HOME_GOAL');
    }
    
    if(oldMatch.AwayTeam.Score !== match.AwayTeam.Score) {
        results.push('AWAY_GOAL');
    }
    
    return results;
}