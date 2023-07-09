const jwt = require('jsonwebtoken');

exports.isAuth = async (req, res, next) => {

    // const { cookies } = req.headers;
    const { cookies } = req;
    // cookies.accessToken
    if (cookies.accessToken) {

        let user = jwt.verify(cookies.accessToken, process.env.SCERET_KEY)

        req.user = user;
        if (!req.user) {
            return res.status(401).send({ messsage: 'Not Authorized!' })
        };

        return next();
    }
    res.status(401).send({ messsage: "Not Authorize,No accessToken" })
}

exports.isADmin = async (req, res, next) => {

    const { role } = req

    if (role !== 'Admin') {
        return res.status(403).json({ message: 'Admin Resource. Access Denied!' });
    }

    next();
}
exports.isNormalUser = async (req, res, next) => {

    const { role } = req

    if (role !== 'user') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    next();
}