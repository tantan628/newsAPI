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
        const checkArticleIdPromise = checkArticleId(articleId);
        const fetchCommentsByIdPromise = fetchCommentsByArticleId(articleId);
        const [ { rows: [article] }, { rows: comments }] = await Promise.all([checkArticleIdPromise, fetchCommentsByIdPromise]);
        if(!article) {
            await Promise.reject({ status: 404, msg: "Article ID not found"})
        }
        res.status(200).send({ comments });
    } catch(err) {
        next(err)
    }
};