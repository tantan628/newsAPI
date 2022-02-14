//----------IMPORTS----------
const express = require('express');
const app = express();
app.use(express.json());

const {
    getTopics
} = require('./controllers/topics-controllers')

const {
    handleBadPath,
    handleServerError
} = require('./controllers/errors-controller');


//-------SERVER METHODS-------
app.get('/api/topics', getTopics);

//-------ERROR HANDLERS-------
app.all('/*', handleBadPath)

app.use(handleServerError);

//----------EXPORTS----------

module.exports = app;