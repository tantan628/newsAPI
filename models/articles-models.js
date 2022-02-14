//------IMPORTS------
const db = require('../db/connection')

//------MODELS------
exports.fetchArticle = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    SELECT *
    FROM articles
    WHERE article_id = $1;`

    //RETURN QUERY
    return db.query(queryStr, [articleId])
};