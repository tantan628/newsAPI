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

exports.fetchArticle = (articleId) => {
    //CREATE QUERY STRING
    const queryStr = `
    SELECT *
    FROM articles
    WHERE article_id = $1;`

    //RETURN QUERY
    return db.query(queryStr, [articleId])
};