//------IMPORTS------
const articlesRouter = require('express').Router();

const {
    getArticles,
    getArticleById,
    incArticleVotes,
    postArticle,
    deleteArticleById
} = require('../controllers/articles-controllers');

const {
    getCommentsByArticleId,
    postCommentByArticleId
} = require('../controllers/comments-controllers');


//----SERVER METHODS----
articlesRouter.route('/')
    .get(getArticles)
    .post(postArticle)

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(incArticleVotes)
    .delete(deleteArticleById)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

//-----EXPORTS-----
module.exports = articlesRouter;