//------IMPORTS------
const db = require('../db/connection')

//------MODELS------
exports.fetchArticles = () => {
	//CREATE QUERY STRING
	const queryStr = `
			SELECT *
			FROM articles;`

	//RETURN QUERY
	return db.query(queryStr);
};

exports.fetchArticleById = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    SELECT *
    FROM articles
    WHERE article_id = $1;`

    //RETURN QUERY
    return db.query(queryStr, [articleId])
};

exports.changeVotes = (articleId, votesInc) => {
    //CREATE QUERY STRING
    const queryStr = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`

    //RETURN QUERY
    return db.query(queryStr, [votesInc, articleId])
};

exports.checkArticleId = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    SELECT *
    FROM articles
    WHERE article_id = $1`

    //RETURN QUERY
    return db.query(queryStr, [articleId])
};

exports.incrementCommentCount = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    UPDATE articles
    SET comment_count = comment_count + 1
    WHERE article_id = $1`

    //RETURN QUERY
    return db.query(queryStr, [articleId]);
};

exports.decrementCommentCount = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    UPDATE articles
    SET comment_count = comment_count - 1
    WHERE article_id = $1`

    //RETURN QUERY
    return db.query(queryStr, [articleId]);
}