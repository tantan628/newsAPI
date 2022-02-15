//-------IMPORTS-------
const {
    fetchArticles,
    fetchArticleById,
    changeVotes
} = require('../models/articles-models');

const {
    fetchCommentsByArticle
} = require('../models/comments-models');

//------CONTROLLERS------
exports.getArticles = async (req, res, next) => {
	try {
		const { rows } = await fetchArticles();
		res.status(200).send({ articles: rows });
	} catch(err) {
		next(err)
	}
};

exports.getArticleById = async (req, res, next) => {
    const articleId = req.params.article_id;
    try{
        const { rows: article } = await fetchArticleById(articleId);
        if(article.length === 0) {
            throw ({ status: 404, msg: "No articles found" })
        }
        res.status(200).send({ article });
    } catch(err) {
        next(err);
    }
};

exports.updateVotes = async (req, res, next) => {
    const articleId = req.params.article_id;
    const votesInc = req.body.inc_votes;
    try{
        const { rows } = await changeVotes(articleId, votesInc);
        if(rows.length === 0) {
            throw({ status: 404, msg: "No articles found" })
        }
        res.status(200).send({ article: rows });
    } catch(err) {
        next(err)
    }
};