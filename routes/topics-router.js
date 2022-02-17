//-------IMPORTS------
const topicsRouter = require('express').Router();

const {
    getTopics
} = require('../controllers/topics-controllers');

//----SERVER METHODS----
topicsRouter.get('/', getTopics);

//-------EXPORTS--------
module.exports = topicsRouter;