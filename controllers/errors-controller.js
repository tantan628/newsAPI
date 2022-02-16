exports.handleBadPath = (req, res) => {
    res.status(404).send({ msg: "Path not found" })
};

exports.handleCustomErrors = (err, req, res, next) => {
    const { status, msg } = err;
    if(status) {
        res.status(status).send({ msg });
    }
    else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
    switch(err.code) {
        case '22P02':
            res.status(400).send({ msg: "Bad Request: Incorrect data type input" });
            break;
        case '23502':
            res.status(400).send({ msg: "Bad Request: Required data missing" });
            break;
        case '23503':
            res.status(404).send({ msg: "Not Found: Required data constraint given not found"});
            break;
        default:
            next(err);
    }
};

exports.handleServerError = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg: "Internal server error"})
};