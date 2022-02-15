//----------IMPORTS----------
const express = require('express');
const app = express();
app.use(express.json());

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
    getCommentsByArticleId
} = require('./controllers/comments-controllers');


//-------SERVER METHODS-------
app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);

app.patch('/api/articles/:article_id', updateVotes);

app.get('/api/users', getUsers);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);


//-------ERROR HANDLERS-------
app.all('/*', handleBadPath)

app.use(handleCustomErrors);

app.use(handlePsqlErrors)

app.use(handleServerError);

//----------EXPORTS----------
module.exports = app;