//-------IMPORTS-------
const {
    fetchArticles,
    fetchArticle
} = require('../models/articles-models')

//------CONTROLLERS------
exports.getArticles = async (req, res, next) => {
	try {
		const { rows } = await fetchArticles();
		res.status(200).send({ articles: rows });
	} catch(err) {
		next(err)
	}
};

exports.getArticle = async (req, res, next) => {
    const articleId = req.params.article_id;
    try{
        const { rows } = await fetchArticle(articleId);
        if(rows.length === 0) {
            throw ({ status: 404, msg: "No articles found" })
        }
        res.status(200).send({ article: rows });
    } catch(err) {
        next(err);
    }
};