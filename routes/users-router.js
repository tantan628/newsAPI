//------IMPORTS------
const usersRouter = require('express').Router();

const {
    getUsers,
    getUserByUsername
} = require('../controllers/users-controllers');

//----SERVER METHODS----
usersRouter.get('/', getUsers);

usersRouter.get('/:username', getUserByUsername);

//------EXPORTS------
module.exports = usersRouter;