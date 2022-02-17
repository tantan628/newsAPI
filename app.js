//----------IMPORTS----------
const express = require('express');
const app = express();
app.use(express.json());

const {
    getEndpoints
} = require('./db/helpers/utils');

const {
    getTopics
} = require('./controllers/topics-controllers');

const {
    getArticles,
    getArticleById,
    updateVotes
} = require('./controllers/articles-controllers');

const {
    getUsers
} = require('./controllers/users-controllers');

const {
    handleBadPath,
    handleCustomErrors,
    handlePsqlErrors,
    handleServerError
} = require('./controllers/errors-controller');

const {
    getCommentsByArticleId,
    postCommentByArticleId,
    deleteComment
} = require('./controllers/comments-controllers');


//-------SERVER METHODS-------
app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/users', getUsers);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);
app.patch('/api/articles/:article_id', updateVotes);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.delete('/api/comments/:comment_id', deleteComment);

//-------ERROR HANDLERS-------
app.all('/*', handleBadPath)

app.use(handleCustomErrors);

app.use(handlePsqlErrors)

app.use(handleServerError);

//----------EXPORTS----------
module.exports = app;