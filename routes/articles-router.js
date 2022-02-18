//------IMPORTS------
const articlesRouter = require('express').Router();

const {
    getArticles,
    getArticleById,
    incArticleVotes
} = require('../controllers/articles-controllers');

const {
    getCommentsByArticleId,
    postCommentByArticleId
} = require('../controllers/comments-controllers');


//----SERVER METHODS----
articlesRouter.get('/', getArticles);

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(incArticleVotes)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

//-----EXPORTS-----
module.exports = articlesRouter;