//------IMPORTS------
const {
    fetchUsers,
	fetchUserByUsername
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

exports.getUserByUsername = async (req, res, next) => {
	const username = req.params.username;
	try {
		const { rows: [user] } = await fetchUserByUsername(username);
		if(!user) {
			await Promise.reject({ status: 404, msg: "Not Found: Username not found" });
		}
		res.status(200).send({ user });
	} catch(err) {
		next(err)
	}
};