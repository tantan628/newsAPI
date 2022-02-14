//-------IMPORTS-------
const {
    fetchArticle,
    changeVotes
} = require('../models/articles-models')

//------CONTROLLERS------
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