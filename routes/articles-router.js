//------IMPORTS------
const articlesRouter = require('express').Router();

const {
    getArticles,
    getArticleById,
    incArticleVotes,
    postArticle
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

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

//-----EXPORTS-----
module.exports = articlesRouter;