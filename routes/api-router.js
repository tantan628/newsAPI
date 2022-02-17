//------IMPORTS------
const apiRouter = require('express').Router();
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');

const {
    getEndpoints
} = require('../db/helpers/utils');

//----SERVER METHODS----
apiRouter.get('/', getEndpoints);


//-----ROUTERS-----
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

//-------EXPORTS-------
module.exports = apiRouter;