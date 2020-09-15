const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.session.token;
        const userInfo = req.session.details;
        if (token == null) {
            next()
        }
        else {
            jwt.verify(token, process.env.jsonSecretToken, function (err, decoded) {
                if (err) {
                    next()
                }
                else {
                    req.auth = decoded
                    res.redirect('/newsFeed');
                }
            });
        }
    }
    catch (e) {
        res.status(400).json({
            status: 0,
            message: 'Invalid Token mohit'
        });
    }
};