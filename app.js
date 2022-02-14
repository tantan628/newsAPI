//----------IMPORTS----------
const express = require('express');
const app = express();
app.use(express.json());

const {
    getArticle
} = require('./controllers/articles-controllers');

const {
    getTopics
} = require('./controllers/topics-controllers');

const {
    handleBadPath,
    handleServerError
} = require('./controllers/errors-controller');


//-------SERVER METHODS-------
app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

//-------ERROR HANDLERS-------
app.all('/*', handleBadPath)

app.use(handleServerError);

//----------EXPORTS----------

module.exports = app;