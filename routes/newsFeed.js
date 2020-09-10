const router = require("express").Router();
const userCheck = require("../model/User");
const moment = require("moment");
const { createPlan, validate} = require('../helper/validation');

router.get("/", async (req, res)=>{
    try {
        res.render('./newsFeed', {title : "Planfrank Login"})
    }catch(error){
        res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
});

router.post("/createPlan", createPlan(), validate, async(req, res)=>{
    try {
        console.log("hi")
        res.json({
            status : 1,
            message : "Success"
        })
    } catch (error) {
        res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
} )

module.exports = router;
