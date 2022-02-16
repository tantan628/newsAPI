//-------IMPORTS-------
const {
    fetchCommentsByArticleId,
    createCommentByArticleId,
    removeComment
}  = require('../models/comments-models');

const {
    checkArticleId,
    incrementCommentCount,
    decrementCommentCount
} = require('../models/articles-models');

//-----CONTROLLERS-----
exports.getCommentsByArticleId = async (req, res, next) => {
    const articleId = req.params.article_id;
    try {
        const checkArticleIdPromise = checkArticleId(articleId);
        const fetchCommentsByIdPromise = fetchCommentsByArticleId(articleId);
        const [{ rows: [article] }, { rows: comments }] = await Promise.all([checkArticleIdPromise, fetchCommentsByIdPromise]);
        if(!article) {
            await Promise.reject({ status: 404, msg: "Article ID not found"})
        }
        res.status(200).send({ comments });
    } catch(err) {
        next(err)
    }
};

exports.postCommentByArticleId = async (req, res, next) => {
    const articleId = req.params.article_id;
    const newComment = req.body
    try {
        const postCommentPromise = createCommentByArticleId(articleId, newComment);
        const incrementPromise = incrementCommentCount(articleId);
        const [{ rows: [comment] }] = await Promise.all([postCommentPromise, incrementPromise]);
        res.status(201).send({ comment });
    } catch(err) {
        next(err)
    }
};

exports.deleteComment = async (req, res, next) => {
    const commentId = req.params.comment_id;
    try {
        const { rows } = await removeComment(commentId);
        if(rows.length === 0) {
            await Promise.reject({ status: 404, msg: "Not Found: Comment not found" });
        }
        const articleId = rows[0].article_id;
        await decrementCommentCount(articleId);
        res.status(204).send()
    } catch(err) {
        next(err)
    }
}