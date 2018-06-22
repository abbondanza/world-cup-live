const MONGO_CONN = require('../config.json').MONGO_CONN;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

module.exports.open = (cb) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(MONGO_CONN, (err, client) => {
            if(err) {
                return reject(err);
            }
            return resolve(client);
        });
    });
}