const fs = require('fs');

const padNum = (n, width, z) => {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const stringDate = (date) => {
    return [date.getFullYear(), padNum((date.getMonth() + 1), 2), padNum(date.getDate(), 2)].join('-');
}

module.exports.log = (msg) => {
    let date = new Date();
    let str = stringDate(date);
    let ts = date.toString();
    let message = `[${ts}] ${msg} \n`;
    let filename = `./logs/${str}.log`;
    if(!fs.existsSync(filename)) {
        fs.writeFileSync(filename, 'START OF LOG \n', 'utf8');
    }
    fs.appendFileSync(filename, message, 'utf8');
}