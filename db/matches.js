module.exports.getMatch = (db, matchId) => {
    return new Promise((resolve, reject) => {
        db.collection('matches').findOne({IdMatch: matchId}, (err, match) => {
            if(err) return reject(err);
            return resolve(match);
        });
    });
}


module.exports.addMatch = (db, matchObj) => {
    return new Promise((resolve, reject) => {
        db.collection('matches').updateOne(
            { IdMatch: matchObj.IdMatch },
            { $set: matchObj },
            { upsert: true },
            (err) => {
                if(err) return reject(err);
                return resolve();
            }
        );
    });
}
