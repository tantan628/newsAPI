//------IMPORTS------
const db = require('../db/connection')

//------MODELS------
exports.fetchCommentsByArticleId = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    SELECT *
    FROM comments
    WHERE article_id = $1;`

    //RETURN QUERY
    return db.query(queryStr, [articleId]);
};

exports.createCommentByArticleId = (articleId, newComment) => {
    //CREATE QUERY STRING
    const queryStr = `
    INSERT INTO comments (body, author, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;`

    //RETURN QUERY
    return db.query(queryStr, [newComment.body, newComment.username, articleId])
};