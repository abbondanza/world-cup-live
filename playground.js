const str = 'mongodb://rabbondanza-admin:uR0iyxviVn8RdSKe@cluster0-shard-00-00-hll86.mongodb.net:27017,cluster0-shard-00-01-hll86.mongodb.net:27017,cluster0-shard-00-02-hll86.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

let cheerio = require('cheerio');
let rp = require('request-promise');
let fifa = require('./service/fifa');
let matches = require('./matches');

// Database Name
// Use connect method to connect to the server
MongoClient.connect(str, (err, client) => {
    if(err) {
        console.log('err', err);
        return;
    }
    console.log("Connected successfully to server");
    let db = client.db('test');
    rp('https://www.fifa.com/worldcup/matches/')
    .then((html) => {
        let $ = cheerio.load(html);
        $('.fi-mu').each((idx, el) => {
            let matchId = $(el).attr('data-id');
            fifa.getMatch(matchId)
            .then((match)=> {
                if(!match || match.MatchStatus === 3) {
                    return;
                }
                
                matches.addMatch(db, match);
            }, (err) => {
                console.log(err)
            })
        })
    })
});


console.log(process.env.DEBUG_NUMBER);