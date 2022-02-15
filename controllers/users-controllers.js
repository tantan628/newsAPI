//------IMPORTS------
const {
    fetchUsers
} = require('../models/users-models');

//------CONTROLLERS------
exports.getUsers = async (req, res, next) => {
	try {
		const { rows: users } = await fetchUsers();
		res.status(200).send({ users });
	} catch(err) {
		next(err)
	}
};