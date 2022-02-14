//------IMPORTS------
const db = require('../db/connection')

//------MODELS------
exports.fetchTopics = () => {
    //CREATE QUERY STRING
    const queryStr = `
    SELECT *
    FROM topics;`

    //RETURN QUERY
    return db.query(queryStr);
};