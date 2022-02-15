//------IMPORTS------
const db = require('../db/connection')

//------MODELS------
exports.fetchCommentsByArticle = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    SELECT *
    FROM comments
    WHERE article_id = $1;`

    //RETURN QUERY
    return db.query(queryStr, [articleId]);
};