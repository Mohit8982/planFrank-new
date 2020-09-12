const router = require("express").Router();
const singlePost = require("../model/Post");
const session = require('../helper/session');
const intrest = require('../model/Plan_category');

router.get("/singlePlan/:id", session, async (req, res)=>{
    try {
        const id = req.params.id;
        const userInfo = req.session.details;
        const post = await singlePost.findOne({_id : id}).populate('postedBy');
        res.render('./singlePost', {title : "Single Post", userInfo : userInfo, postData :post})
    } catch (error) {
        res.json({
            status : 0,
            message : `Server Error ${error.toString()}`
        })
    }
});

router.get("/makePlan", session, async (req, res)=>{
    try {
        const userInfo = req.session.details;
        const intrestList = await intrest.find();
        res.render('./makePlan', {title : "Create New Plan", userInfo : userInfo, intrestList : intrestList})
    } catch (error) {
        res.json({
            status : 0,
            message : `Server Error ${error.toString()}`
        })
    }
});

module.exports = router;
