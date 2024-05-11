"use strict";
const pool = require('./config');

// export query
module.exports = {
    update: (text, params) => {
        return pool.query(`${text} RETURNING *`, params)
    },
    query: (text, params) => {
        return pool.query(`${text}`, params)
    },
    getClient: () => pool.connect(),
};