const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

module.exports.open = (cb) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(process.env.MONGO_CONN, (err, client) => {
            if(err) {
                return reject(err);
            }
            return resolve(client);
        });
    });
}