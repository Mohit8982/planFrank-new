const router = require("express").Router();
const createPost = require("../model/Post");
const user = require("../model/User");
const pinned = require("../model/Pinned_Post");
const intrest = require("../model/Plan_category");
const fetch = require("node-fetch");
const moment = require("moment");
const session = require('../helper/session');
const { createPlan, validate} = require('../helper/validation');

router.get("/", session, async (req, res)=>{
    try {
        const userInfo = req.session.details;
        const findIntrest = await createPost.find().populate('postedBy', {name : 1, username : 1}).sort({_id: -1}).limit(10);
        res.render('./newsFeed', {title : "Plan's" , userInfo : userInfo, feedData : findIntrest})
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
        const userId = userInfo.userId;
        const totalPost = userInfo.totalPost;
        const {title, planTimeStart, planTimeEnd, planDate, planLocation, planCategory, description} = req.body;
        const todayDate = moment().format('YYYY-MM-DD');
        const checkDate = moment(planDate).isBefore(todayDate);
        const timeStart = moment(planTimeStart, "hh:mm").format("hh:mm a");
        const timeEnd = moment(planTimeEnd, "hh:mm").format("hh:mm a");
        if(checkDate == false)
        {
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress ||req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);
            let postedFrom = 'Location Not Available';
            const link = `http://api.ipstack.com/${ip}?access_key=4c05f981aab9be3bd0989f09987ce041`;
            const locality =  await getLocation(link);
            city = locality.city; 
            state = locality.region_name;
            postedFrom = `${city}, ${state}`;
            const split = planCategory.split("||");
            const category_id = split[0];
            const category_name = split[1];
            const Post = new createPost({
                title : title,
                description: description,
                planTime : `${timeStart} - ${timeEnd}`,
                planDate : planDate,
                planLocation : planLocation,
                postedFrom : postedFrom,
                postedBy : userId,
                planCategory : category_id,
                planCategoryname : category_name,
                commentCount: 0,
                likesCount : 0,
                createdAt : moment().format("DD/MM/YYYY hh:mm a"),
                timeStamp : moment().unix()
            })
            const postData = await Post.save();
            await user.updateOne({_id : userId},{ $inc : { total_post : 1 } });
            await intrest.updateOne({_id : category_id},{ $inc : { intrest_count : 1 } });
            userInfo.totalPost = totalPost + 1;
            return res.json({
                status : 1,
                message : "Success",
                postData : postData,
                userInfo :userInfo
            })
        }
        else{
            return res.json({
                status : 0,
                message : "Sorry Plan Date Cannot be Past Date"
            })
        }
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

router.post('/trendingPlan', session, async (req, res)=>{
    try {
        const todayDate = moment().format('DD/MM/YYYY')
        const timStamp = moment(todayDate,'DD/MM/YYYY').unix();
        const trendingPost = await createPost.find({ timeStamp : { $gte : timStamp } }).populate('postedBy', {name : 1, username : 1}).sort({likesCount: -1, commentCount : -1}).limit(10);
        res.json({
            status : 1,
            message : "Trending Post Link",
            data : trendingPost
        })
    } catch (error) {
        res.json({
            status : 0,
            message : `Server Error : ${error.toString()}`
        })
    }
})

router.post('/likeUnlike', session, async (req, res)=>{
    try {
        const {type, postId} = req.body;
        const userInfo = req.session.details;
        const userId = userInfo.userId;
        let query = {
            $inc : { likesCount : -1  },
            $pull: { likes : userId  }
        }
        if(type == 1){
            query = { 
                $inc : { likesCount : 1  },
                $push : {likes : userId}
            }
        }
        
        const trendingPost = await createPost.updateOne({_id : postId}, query);

        res.json({
            status : 1,
            message : trendingPost
        })
    } catch (error) {
        res.json({
            status : 0,
            message : `Server Error : ${error.toString()}`
        })
    }
})

router.post('/pinPost', session, async (req, res)=>{
    try {
        const { postId, planStamp } = req.body;
        const userInfo = req.session.details;
        const userId = userInfo.userId
        const todayDate = moment().format('DD/MM/YYYY')
        const timStamp = moment(todayDate,'DD/MM/YYYY').unix();
        const pinData = new pinned({
            post_id : postId,
            user_id: userId,
            timestamp:timStamp,
            planStamp :planStamp,
            createdOn:todayDate
        })

        await pinData.save();

        const post = await createPost.findOneAndUpdate({_id : postId},{
            $inc : { PinnedCount : 1  },
            $push : {Pinned : userId}
        },{
            new: true,
            upsert: true,
        })

        res.json({
            status : 1,
            message : "Plan Pinned Successfully",
            data : post
        })
    } catch (error) {
        res.json({
            status : 0,
            message : `Server Error : ${error.toString()}`
        })
    }
})

router.post('/getPinPost', session, async (req, res)=>{
    try {
        const userInfo = req.session.details;
        const userId = userInfo.userId
        const post = await pinned.find({user_id : userId}).populate('post_id', {title : 1, postedFrom : 1}).sort({_id: -1}).limit(5);
        
        res.json({
            status : 1,
            message : "Pinned Post List",
            data : post
        })
    } catch (error) {
        res.json({
            status : 0,
            message : `Server Error : ${error.toString()}`
        })
    }
});

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