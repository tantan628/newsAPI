//----------IMPORTS----------
const express = require('express');
const app = express();
app.use(express.json());

const {
    getTopics
} = require('./controllers/topics-controllers');

const {
    getArticle,
    updateVotes
} = require('./controllers/articles-controllers');

const {
    handleBadPath,
    handleCustomErrors,
    handlePsqlErrors,
    handleServerError
} = require('./controllers/errors-controller');

const {
    getUsers
} = require('./controllers/users-controllers');


//-------SERVER METHODS-------
app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

app.patch('/api/articles/:article_id', updateVotes);

app.get('/api/users', getUsers);


//-------ERROR HANDLERS-------
app.all('/*', handleBadPath)

app.use(handleCustomErrors);

app.use(handlePsqlErrors)

app.use(handleServerError);

//----------EXPORTS----------

module.exports = app;