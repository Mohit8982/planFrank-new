const jwt = require('jsonwebtoken');

module.exports = function (req,res,next) {
    try
    {
        const token = req.session.token;
        if (token == null){
            return res.redirect('/');
        }
        else {
            jwt.verify(token, process.env.jsonSecretToken, function (err, decoded) {
                if (err) {
                    res.redirect('/');
                } 
                else {
                    req.auth = decoded 
                    next()                        
                }
            });    
        }
    }
    catch (e) {
        res.status(400).json({
            status: 0,
            message: 'Invalid Token'
        });
    }
};