const router = require("express").Router();
const createPost = require("../model/Post");
const user = require("../model/User");
const intrest = require("../model/Plan_category");
const moment = require("moment");
const session = require('../helper/session');
const request = require('request');
const { createPlan, validate} = require('../helper/validation');

router.get("/", session, async (req, res)=>{
    try {
        const userInfo = req.session.details;
        res.render('./newsFeed', {title : "Planfrank Login", userInfo : userInfo})
    }catch(error){
        res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
});

router.post("/createPlan", session, createPlan(), validate, async(req, res)=>{
    try {
        const userInfo = req.session.details;
        const userId = userInfo.userId
        const {title, planTimeStart, planTimeEnd, planDate, planLocation, planCategory, description} = req.body;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

        ip = '27.5.7.160';

        const link = `http://api.ipstack.com/${ip}?access_key=4c05f981aab9be3bd0989f09987ce041`;
        let city = ''; 
        let state = '';

        var options = {
            'method': 'GET',
            'url': link,
            'headers': {
                'Cookie': '__cfduid=d379be94a28ce205e99efd5ad24673a7b1599723116'
            }
            };
            request(options, function (error, response) {
            if (error) throw new Error(error);
            // console.log(response.body);
            city = response.body.city;
            state = response.body.region_name;

            console.log(response.body.city)
            console.log(response.body.region_name)

        });


        const Post = new createPost({
            title : title,
            description: description,
            planTime : `${planTimeStart} - ${planTimeEnd}`,
            planDate : planDate,
            planLocation : planLocation,
            postedFrom : `${city}, ${state}`,
            postedBy : userId,
            planCategory : planCategory,
            commentCount: 0,
            likesCount : 0,
            createdAt : moment().format("DD/MM/YYYY hh:mm a"),
            timeStamp : moment().unix()
        })
        await Post.save();
        await user.updateOne({_id : userId},{ $inc : { total_post : 1 } });
        await intrest.updateOne({_id : planCategory},{ $inc : { intrest_count : 1 } });


        res.json({
            status : 1,
            message : "Success"
        })
    } catch (error) {
        console.log(error)
        res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
});

router.post('/createIntrest', async(req, res)=>{
    try {
        const userid = req.session.details;
        const { intrestName } = req.body;
        const category = new intrest({
            intrest_name: intrestName,
            timestamp: moment().unix(),
            createdOn: moment().format("DD/MM/YYYY hh:mm a"),
            createdBy : userid
        })
        await category.save()
        res.json({
            status : 1,
            message : "Created Successfully..."
        })
    } catch (error) {
        res.json({
            status : 0,
            message : error.toString()
        })
    }
})

router.post('/intrestList', session, async(req, res)=>{
    try {
        const list  = await intrest.find();
        res.json({
            status : 1,
            message : "Created Successfully...",
            data : list
        })
    } catch (error) {
        res.json({
            status : 0,
            message : error.toString()
        })
    }
})

module.exports = router;
