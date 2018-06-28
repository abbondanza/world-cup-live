let clone = require('clone');
let expect = require('expect');
let notifHelper = require(__dirname + '/util/notif-helper');

let base = {
    HomeTeam: {Score: 0},
    AwayTeam: {Score: 0}
}

describe('notifHelper', () => {
    describe('getAction()', () => {
        it('should return HOME_GOAL', () => {
            let result = notifHelper.getAction(
                {
                    HomeTeam: {Score: 1},
                    AwayTeam: {Score: 0},
                    MatchStatus: 3
                },
                {
                    HomeTeam: {Score: 0},
                    AwayTeam: {Score: 0},
                    MatchStatus: 3
                }
            );
            expect(result).toBe('HOME_GOAL');
        })
        
        it('should return AWAY_GOAL', () => {
            let result = notifHelper.getAction(
                {
                    HomeTeam: {Score: 0},
                    AwayTeam: {Score: 0},
                    MatchStatus: 3
                },
                {
                    HomeTeam: {Score: 0},
                    AwayTeam: {Score: 1},
                    MatchStatus: 3
                }
            );
            expect(result).toBe('AWAY_GOAL');
        })
        
        it('should return GAME_STARTED', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3}),
                Object.assign(clone(base), {MatchStatus: 0})
            );
            expect(result).toBe('GAME_STARTED');
        })
        
        it('should return GAME_STARTED', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3})
            );
            expect(result).toBe('GAME_STARTED');
        })
        
        it('should return GAME_OVER', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 0}),
                Object.assign(clone(base), {MatchStatus: 3})
            );
            expect(result).toBe('GAME_OVER');
        })

        it('should return HALF_TIME', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3, Period: 4}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 1})
            );
            expect(result).toBe('HALF_TIME');
        })
        
        it('should return SECOND_HALF', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3, Period: 5}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 4})
            );
            expect(result).toBe('SECOND_HALF');
        })
        
         it('should return FULL_TIME', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3, Period: 10}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 9})
            );
            expect(result).toBe('FULL_TIME');
        })
        
        it('should return EXTRA_TIME', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3, Period: 6}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 5})
            );
            expect(result).toBe('EXTRA_TIME');
        })
        
        it('should return EXTRA_HALF_TIME', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3, Period: 8}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 6})
            );
            expect(result).toBe('EXTRA_HALF_TIME');
        })
        
        it('should return EXTRA_SECOND_HALF', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3, Period: 9}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 8})
            );
            expect(result).toBe('EXTRA_SECOND_HALF');
        })
        
        it('should return PENALTY_SHOOTOUT', () => {
            let result = notifHelper.getAction(
                Object.assign(clone(base), {MatchStatus: 3, Period: 11}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 9})
            );
            expect(result).toBe('PENALTY_SHOOTOUT');
        })

    })
})

