const express = require('express')
const app = express()

const twilio = require('twilio')

const MessagingResponse = twilio.twiml.MessagingResponse

const phones = require('./db/phones');
const matches = require('./db/matches');
const notifications = require('./db/notifications');

const fifaApi = require('./service/fifa');
const notifHelper = require('./util/notif-helper');
const mongoConn = require('./util/mongo-conn');

let mongoClient = null;
let db = null;
mongoConn.open().then((client) => {
    let port = process.env.PORT || 3000
    let host = process.env.IP || "0.0.0.0"
    mongoClient = client;
    db = client.db('test');
    
    app.listen(port, host, () => {
      console.log(`WC Notifier listening on port ${host}:${port}`)
    })
})

 
// Find your account sid and auth token in your Twilio account Console.
let client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_API_KEY)

const verifyNumber = (num) => {
    return !!num.match(/^\+1[\d]{10}?/)
}

app.use(express.json())
app.use(express.urlencoded())

const notify = (message, debug) => {
    return new Promise((resolve, reject) => {
        phones.getNumbers(db).then((nums) => {
            if(!nums.length) {
                return resolve();
            }
            
            if(debug) {
                nums = nums.filter((item) => item.debug);
            }

            nums.map((num) => {
                num = num.number;
                client.messages.create({
                  to: num,
                  from: process.env.TWILIO_NUMBER,
                  body: message
                })
            });
            
            return resolve();
        }, (err) => {
            return reject(err);
        })
    });
}

app.get('/', (req, res) => {
    return res.status(200).json({ message: `World Cup Notifier is LIVE!` })
})

app.post('/sms', (req, res) => {
    const twiml = new MessagingResponse();
    let message = req.body.Body.toLowerCase().trim();
    let from = req.body.From;
    
    let promise = new Promise((resolve) => {
        resolve();
    });
    if (message === 'start' || message === 'hello') {
        if(verifyNumber(from)) {
            promise = phones.addNumber(db, from).then(() => {
                twiml.message(
                    'Welcome to World Cup Live! ' +
                    'This confirms that you have registered to receive match alerts. ' + 
                    'Text us \'hello\' or \'bye\' at any time to start/stop receiving notifications.'
                );
                return true;
            }, () => {
                twiml.message('Your number is already in our system.');
                return true;
            });
        }
    } else if (message === 'stop' || message === 'bye') {
        if(verifyNumber(from)) {
            promise = phones.removeNumber(db, from).then(() => {
                twiml.message('You have been removed from our notifications list. Have a good day!');
                return true;
            }, () => {
                twiml.message('Your number is not in our system. You\'re all set!');
                return true;
            });
        }
    } else {
        twiml.message(
          'Sorry. We did not recognize this command. Please reply with \'hello\' or \'bye\' to start/stop receiving notifications.'
        );
    }
    
    promise.then(() => {
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    })
})

app.get('/fetch', (req, res) => {
    // some auth?
    console.log('fifa fetch');
    fifaApi.getRecent().then((recentMatches) => {
        recentMatches.map((match) => {
            let actions = [];
             
            matches.getMatch(db, match.IdMatch).then((oldMatch) => {
                // if match is not in system and current match not live
                if(!oldMatch && match.MatchStatus !== 3) {
                    return;
                }
    
                actions = notifHelper.getActions(match, oldMatch);
                
                if(!actions.length) {
                    // nothings changed
                    console.log(`[${match.IdMatch}] NO UPDATES`);
                    return;
                }
                
                matches.addMatch(db, match).then(() => {
                    actions.map((action) => {
                        let msg = notifHelper.buildMsg(action, match);
                        if(!msg) {
                            console.log(`[${match.IdMatch}] UNHANDLED UPDATE ${action}`);
                            return;
                        }
                        
                        notify(msg).then(() => {
                            console.log(`[${match.IdMatch}] MESSAGE SENT ${action}`);
                        }, () => {
                            console.log(`[${match.IdMatch}] MESSAGE NOT SENT ${action}`);
                        });
                        
                        notifications.addNotification(db, action, match.IdMatch);  
                    })
                })
            })
        });
        // ehh - shouldn't be here
        return res.status(200).json({ message: `Done` });
    }).catch((err) => {
        console.log(err)
        return res.status(500).json({ message: err })
    })
})