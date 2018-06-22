module.exports.addNumber = (db, number) => {
    return new Promise((resolve, reject) => {
        db.collection('phonebook').updateOne(
            { number: number },
            { $set: { number: number }},
            { upsert: true },
            (err, r) => {
                if(err) return reject(err);
                if(r.upsertCount) return reject();
                return resolve();
            }
        );
    });
}

module.exports.removeNumber = (db, number) => {
    return new Promise((resolve, reject) => {
        db.collection('phonebook').deleteOne(
            { number: number },
            (err) => {
                if(err) return reject(err);
                return resolve();
            }
        );
    });
}

module.exports.getNumbers = (db) => {
    return new Promise((resolve, reject) => {
        db.collection('phonebook').find().toArray((err, docs) => {
            if(err) return reject(err);
            return resolve(docs);
        });
    });
}
