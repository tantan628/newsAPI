//------IMPORTS------
const articlesRouter = require('express').Router();

const {
    getArticles,
    getArticleById,
    updateVotes
} = require('../controllers/articles-controllers');

const {
    getCommentsByArticleId,
    postCommentByArticleId
} = require('../controllers/comments-controllers');


//----SERVER METHODS----
articlesRouter.get('/', getArticles);

articlesRouter.route('/:article_id')
    .get(getArticleById)
    .patch(updateVotes)

articlesRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

//-----EXPORTS-----
module.exports = articlesRouter;