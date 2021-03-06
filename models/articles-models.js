//------IMPORTS------
const db = require('../db/connection')

//------MODELS------

exports.fetchArticles = (sort_by = 'created_at', order = 'desc', topic) => {
	//SORT_BY VALIDATION
    const validSortBys = ['title', 'topic', 'author', 'body', 'created_at', 'votes', 'comment_count'];
    if(!validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: "Bad Request: Invalid sort_by query" });
    }
    
    //ORDER VALIDATION
    const validOrders = ['ASC', 'DESC'];
    if(!validOrders.includes(order.toUpperCase())) {
        return Promise.reject({ status: 400, msg: "Bad Request: Invalid order query"});
    }

    //CREATE QUERY STRING
	let queryStr = "SELECT author, title, article_id, topic, created_at, votes, comment_count FROM articles ";

    if(topic) {
        queryStr += "WHERE topic = $1 ";
    };

    queryStr += `ORDER BY ${sort_by} ${order};`;

	//RETURN QUERY
	if(topic) return db.query(queryStr, [topic]);
    
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

exports.changeArticleVotes = (articleId, votesInc) => {
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
};

exports.createArticle = (author, title, body, topic) => {
    //CREATE QUERY STRING
    const queryStr =`
    INSERT INTO articles (author, title, body, topic)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`

    //RETURN QUERY
    return db.query(queryStr, [author, title, body, topic]);
};

exports.removeArticleById = (articleId) => {
    //CREATE QUERY STRING
    const queryStr =`
    DELETE
    FROM articles
    WHERE article_id = $1
    RETURNING *;`

    //RETURN QUERY
    return db.query(queryStr, [articleId]);
};