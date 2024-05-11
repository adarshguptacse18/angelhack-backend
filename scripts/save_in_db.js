require('dotenv').config();
const db = require('../db');
const allCompaniesEntries = require('./users.json');

const entry = allCompaniesEntries[0];
allCompaniesEntries.forEach(entry =>  {
    db.update("INSERT INTO \"PAN_INFO\" (pan, data) values ($1, $2)", [entry.pan, entry]);
})


