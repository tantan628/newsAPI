//-------IMPORTS-------
const {
    fetchArticle
} = require('../models/articles-models')

//------CONTROLLERS------
exports.getArticle = async (req, res, next) => {
    const articleId = req.params.article_id;
    try{
        const { rows } = await fetchArticle(articleId);
        console.log(rows);
        res.status(200).send({ article: rows });
    } catch(err) {
        next(err);
    }

}