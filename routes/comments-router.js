//------IMPORTS-----
const commentsRouter = require('express').Router();

const {
    deleteComment,
    incCommentVotes
} = require('../controllers/comments-controllers');

//-----SERVER METHODS-----
commentsRouter.route('/:comment_id')
    .delete(deleteComment)
    .patch(incCommentVotes)

commentsRouter.delete('/:comment_id', deleteComment);

//------EXPORTS------
module.exports = commentsRouter;