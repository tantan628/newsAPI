//------IMPORTS------
const {
    fetchUsers
} = require('../models/users-models');

//------CONTROLLERS------
exports.getUsers = async (req, res, next) => {
	try {
		const { rows } = await fetchUsers();
		res.status(200).send({ users: rows });
	} catch(err) {
		next(err)
	}
};