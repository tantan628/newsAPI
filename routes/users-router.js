//------IMPORTS------
const usersRouter = require('express').Router();

const {
    getUsers
} = require('../controllers/users-controllers');

//----SERVER METHODS----
usersRouter.get('/', getUsers);

//------EXPORTS------
module.exports = usersRouter;