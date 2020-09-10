const router = require("express").Router();
const createPost = require("../model/Post");
const user = require("../model/User");
const intrest = require("../model/Plan_category");
const fetch = require("node-fetch");
const moment = require("moment");
const session = require('../helper/session');
const { createPlan, validate} = require('../helper/validation');

router.get("/", session, async (req, res)=>{
    try {
        const userInfo = req.session.details;
        const findIntrest = await createPost.find().populate('postedBy', {name : 1, username : 1});
        res.render('./newsFeed', {title : "Planfrank Login", userInfo : userInfo, feedData : findIntrest})
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
        const locality =  await getLocation(link);
        const city = locality.city; 
        const state = locality.region_name;
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
        const postData = await Post.save();
        await user.updateOne({_id : userId},{ $inc : { total_post : 1 } });
        await intrest.updateOne({_id : planCategory},{ $inc : { intrest_count : 1 } });
        res.json({
            status : 1,
            message : "Success",
            postData : postData,
            userInfo :userInfo
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

async function getLocation(link)
{
    let dataProvider;
    await fetch(link, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			dataType: "json",
		},
	})
		.then((res) => res.json())
		.then((response) => {
			dataProvider = response;
		});
    
	return Promise.resolve(dataProvider);

}

module.exports = router;
