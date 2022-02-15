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