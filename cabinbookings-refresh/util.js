const Mysql = require('./mysql.js');
require('dotenv').config();

function parseDate(datestr) {
    let date = null;
    if(datestr) {
        let re = new RegExp(/(\d{1,2}).(\d{1,2}).(\d{4})/);
        let m = re.exec(datestr);
        if(m) {
            date = new Date(m[3], m[2]-1, m[1], 16);       // Use 16 as the clock as then the reservations start
            if(date.getMonth() != m[2]-1 || date.getDate() != m[1]) {
                date = null;
            }
        }
    }
    return date;
}

function convertArray(array) {
    return (array) ? array
    .map(item => {
        parsedDate = toSimpleDate(parseDate(item.date), '-');
        return (parsedDate) ? parsedDate + "," + parseInt(item.booked) : null;
    })
    .filter(item => item != null)
    .join("\r\n")
     : null;
}

function toSimpleDate(date, delim = '') {
    if(!date) { return null; }
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
  
    return [date.getFullYear(),
            (mm>9 ? '' : '0') + mm,
            (dd>9 ? '' : '0') + dd
           ].join(delim);
}

function saveToDatabase(capacityJson) {
    return new Promise( ( resolve, reject ) => {
        let db = new Mysql({
            host: "mariadb",
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD
        });
        /* Prepare database */
        db.query("CREATE DATABASE IF NOT EXISTS cabok_db")
        .then(rows => db.query("CREATE TABLE IF NOT EXISTS cabok_db.bookings (date DATETIME PRIMARY KEY, booked BOOLEAN NOT NULL, created TIMESTAMP DEFAULT NOW(), updated TIMESTAMP ON UPDATE NOW())"))
        .then(rows => {
            capacityJson.forEach((item) => {
                db.queryWithParams("INSERT INTO cabok_db.bookings (date, booked) VALUES(?, ?) ON DUPLICATE KEY UPDATE booked = VALUES(booked)", [parseDate(item.date).toISOString().slice(0, 19).replace('T', ' '), item.booked])
            });
        })
        .then(rows => resolve(1))
        .catch(err => {
            console.log("Error occurred: " + err);
            return reject(err);
        })
        .finally(() => {
            db.close();    
        })
    });
}

module.exports = { parseDate, convertArray, toSimpleDate, saveToDatabase };

