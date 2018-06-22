module.exports.addNotification = (db, action, matchId) => {
    return new Promise((resolve, reject) => {
        
        let doc = {
            action: action,
            matchId: matchId,
            datetime: new Date()
        }; 
        db.collection('notifications').insertOne(
            doc,
            (err) => {
                if(err) return reject(err);
                return resolve();
            }
        );
    });
}
