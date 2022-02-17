//-------IMPORTS-------
const {
    fetchArticles,
    fetchArticleById,
    changeVotes
} = require('../models/articles-models');

//------CONTROLLERS------
exports.getArticles = async (req, res, next) => {
	try {
		const { rows: articles } = await fetchArticles();
        console.log(articles)
		res.status(200).send({ articles });
	} catch(err) {
		next(err)
	}
};

exports.getArticleById = async (req, res, next) => {
    const articleId = req.params.article_id;
    try{
        const { rows: [article] } = await fetchArticleById(articleId);
        if(!article) {
            await Promise.reject({ status: 404, msg: "No articles found" })
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
        const { rows: [article] } = await changeVotes(articleId, votesInc);
        if(!article) {
            await Promise.reject({ status: 404, msg: "No articles found" })
        }
        res.status(200).send({ article });
    } catch(err) {
        next(err)
    }
};