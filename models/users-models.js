//------IMPORTS------
const db = require('../db/connection')

//------MODELS------
exports.fetchUsers = () => {
	//CREATE QUERY STRING
	const queryStr = `
			SELECT *
			FROM users;`

	//RETURN QUERY
	return db.query(queryStr);
};

exports.fetchUserByUsername = (username) => {
	//CREATE QUERY STRING
	const queryStr = `
	SELECT *
	FROM users
	WHERE username = $1;`

	//RETURN QUERY
	return db.query(queryStr, [username]);
};