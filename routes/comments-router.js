//------IMPORTS-----
const commentsRouter = require('express').Router();

const {
    deleteComment
} = require('../controllers/comments-controllers');

//-----SERVER METHODS-----
commentsRouter.delete('/:comment_id', deleteComment);

//------EXPORTS------
module.exports = commentsRouter;