const jwt = require('jsonwebtoken');
const checkUser = require('../model/User');

module.exports = async function (req,res,next) {
    try
    {
        const token = req.session.token;
        const userInfo = req.session.details;
        if(userInfo){
            const userId =  userInfo.userId;
            const user = await checkUser.findOne({_id : userId, verified : true})
            if(user == null){
                return res.redirect('/');
            }
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
        else{
            return res.redirect('/');
        }
        
    }
    catch (e) {
        console.log(e)
        res.status(400).json({
            status: 0,
            message: 'Invalid Token mohit'
        });
    }
};