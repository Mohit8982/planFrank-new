const router = require("express").Router();
const indexSession = require('../helper/indexSession');
const session = require('../helper/session');

router.get("/", indexSession, async (req, res)=>{
    try {
        res.render('./index', {title : "Planfrank Login", data : ""})
    }catch(error){
        res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
});

router.get('/logout', session, async (req, res) => {
    try {
        const userInfo = req.session.details;
        if(userInfo.role === 3 || userInfo.role === 4){
            req.session.destroy(function (err) {
                res.redirect('/subadminLogin');
            })
        }else{
            req.session.destroy(function (err) {
                res.redirect('/');
            })
        }
    } catch (e) {
        res.json({ status: 0, message: e.toString() });
    }
});

module.exports = router;