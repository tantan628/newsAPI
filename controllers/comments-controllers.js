//-------IMPORTS-------
const {
    fetchCommentsByArticleId
}  = require('../models/comments-models');

const {
    checkArticleId
} = require('../models/articles-models');

//-----CONTROLLERS-----
exports.getCommentsByArticleId = async (req, res, next) => {
    const articleId = req.params.article_id;
    try {
        const { rows: article } = await checkArticleId(articleId);
        if(article.length === 0) {
            throw({ status: 404, msg: "Article ID not found"})
        }
        const { rows: comments } = await fetchCommentsByArticleId(articleId);
        res.status(200).send({ comments });
    } catch(err) {
        next(err)
    }
};