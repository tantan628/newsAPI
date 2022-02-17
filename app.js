//----------IMPORTS----------
const express = require('express');
const app = express();
app.use(express.json());
const apiRouter = require('./routes/api-router');

const {
    handleBadPath,
    handleCustomErrors,
    handlePsqlErrors,
    handleServerError
} = require('./controllers/errors-controller');


//-------ROUTER-------
app.use('/api', apiRouter);


//-------ERROR HANDLERS-------
app.all('/*', handleBadPath)

app.use(handleCustomErrors);

app.use(handlePsqlErrors)

app.use(handleServerError);

//----------EXPORTS----------
module.exports = app;