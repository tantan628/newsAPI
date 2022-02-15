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
            res.status(400).send({ msg: "Bad request: Incorrect data type input" })
            break;
    }
    next(err);
}

exports.handleServerError = (err, req, res, next) => {
    // console.log(err)
    res.status(500).send({ msg: "Internal server error"})
};