//-------IMPORTS-------
const {
    fetchTopics
} = require('../models/topics-models')

//------CONTROLLERS------
exports.getTopics = async (req, res, next) => {
    try{ 
        const { rows } = await fetchTopics();
        res.status(200).send({ topics: rows });
    } catch(err) {
        next(err)
    }
};