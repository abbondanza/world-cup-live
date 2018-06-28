let clone = require('clone');
let expect = require('expect');
let notifHelper = require(__dirname + '/util/notif-helper');

let base = {
    HomeTeam: {Score: 0},
    AwayTeam: {Score: 0}
}

describe('notifHelper', () => {
    describe('getActions()', () => {
        it('should return HOME_GOAL', () => {
            let result = notifHelper.getActions(
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
            expect(result.length).toBe(1);
            expect(result[0]).toBe('HOME_GOAL');
        })
        
        it('should return AWAY_GOAL', () => {
            let result = notifHelper.getActions(
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
            expect(result.length).toBe(1);
            expect(result[0]).toBe('AWAY_GOAL');
        })
        
        it('should return GAME_STARTED', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3}),
                Object.assign(clone(base), {MatchStatus: 0})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('GAME_STARTED');
        })
        
        it('should return GAME_STARTED', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('GAME_STARTED');
        })
        
        it('should return GAME_OVER', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 0}),
                Object.assign(clone(base), {MatchStatus: 3})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('GAME_OVER');
        })

        it('should return HALF_TIME', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3, Period: 4}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 1})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('HALF_TIME');
        })
        
        it('should return SECOND_HALF', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3, Period: 5}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 4})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('SECOND_HALF');
        })
        
         it('should return FULL_TIME', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3, Period: 10}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 9})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('FULL_TIME');
        })
        
        it('should return EXTRA_TIME', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3, Period: 6}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 5})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('EXTRA_TIME');
        })
        
        it('should return EXTRA_HALF_TIME', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3, Period: 8}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 6})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('EXTRA_HALF_TIME');
        })
        
        it('should return EXTRA_SECOND_HALF', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3, Period: 9}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 8})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('EXTRA_SECOND_HALF');
        })
        
        it('should return PENALTY_SHOOTOUT', () => {
            let result = notifHelper.getActions(
                Object.assign(clone(base), {MatchStatus: 3, Period: 11}),
                Object.assign(clone(base), {MatchStatus: 3, Period: 9})
            );
            expect(result.length).toBe(1);
            expect(result[0]).toBe('PENALTY_SHOOTOUT');
        })
        
        it('should return AWAY_GOAL and HALF_TIME', () => {
            let result = notifHelper.getActions(
                {
                    HomeTeam: {Score: 0},
                    AwayTeam: {Score: 0},
                    MatchStatus: 3,
                    Period: 4
                },
                {
                    HomeTeam: {Score: 0},
                    AwayTeam: {Score: 1},
                    MatchStatus: 3,
                    Period: 3
                }
            );
            expect(result.length).toBe(2);
            expect(result.sort()).toEqual(['AWAY_GOAL', 'HALF_TIME']);
        })
        
        it('should return HOME_GOAL and GAME_OVER', () => {
            let result = notifHelper.getActions(
                {
                    HomeTeam: {Score: 1},
                    AwayTeam: {Score: 0},
                    MatchStatus: 0
                },
                {
                    HomeTeam: {Score: 0},
                    AwayTeam: {Score: 0},
                    MatchStatus: 3
                }
            );
            expect(result.length).toBe(2);
            expect(result.sort()).toEqual(['GAME_OVER', 'HOME_GOAL']);
        })
        

    })
})

