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

exports.changeVotes = (articleId, votesInc) => {
    console.log(articleId, votesInc)
    //CREATE QUERY STRING
    const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`

    //RETURN QUERY
    return db.query(queryStr, [votesInc, articleId])
};