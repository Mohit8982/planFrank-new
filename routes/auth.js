const router = require("express").Router();
const userCheck = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const nodemailer = require("nodemailer");
const { resgitrationVali, loginVali, validate} = require('../helper/validation');

router.post("/registerUser", resgitrationVali(), validate, async (req, res)=>{
    try {
        const { username, email, name, password, mobile } = req.body;
        const checkUser = await userCheck.findOne({username : username},{_id : 1});

        if(checkUser){
            return res.json({
                status : 0,
                message : "Woopssss Username Already Taken...!!!!"
            })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const currentTime = moment().format("DD/MM/YYYY hh:mm:ss a");
        const timeStamp = moment(currentTime , "DD/MM/YYYY hh:mm:ss a").unix();
        const verficationCode = Math.floor(100000 + Math.random() * 900000);
        
        const register = new userCheck({
            username : username, 
            email : email, 
            name : name,
            mobile : mobile,
            hashed_password :hashedPassword,
            created : currentTime,
            verified : false,
            timeStamp : timeStamp,
            veri_code : verficationCode
        });

        const saveUser = await register.save();
        const url = `https://testproject.winguardians.com//auth/verifyUser/${saveUser._id}###${verficationCode}`;
        sendMail(name, email, url);
        res.json({
            status : 1,
            message : `Hello ${name}, we've sent an Email on the Email Id provided by you, Please Verify Your Email to Login`
        })
    }catch(error){
        res.json({
            staus : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
});

router.post("/authLogin", loginVali(), validate, async (req, res)=>{
    try {
        const { username, password } = req.body;
        const Check_user = await userCheck.findOne({username : username});
        if(Check_user === null){
            return res.json({
                status : 0,
                message : "Username Not Found"
            })
        }
        const validPass = await bcrypt.compare( password, Check_user.hashed_password);
        if(!validPass){
            return res.json({
                status : 0,
                message : `Invalid Password, Enter Correct Password`
            })
        }

        let veriCheck = Check_user.verified
        if(veriCheck == false){
            return res.json({
                status : 0,
                message : `${username} Your Account is not verified, kindly verify your account.`
            })
        }

        const token = jwt.sign(
            { key: Check_user._id },
            process.env.jsonSecretToken
        );
        let details = {
            name: Check_user.name,
            user_id: Check_user._id,
            username: Check_user.username,
            mobile: Check_user.mobile,
        };
        req.session.details = details;
        req.session.token = token;
        res.json({
            status : 1,
            message : "Success",
            url : "/newsFeed"
        })
    } catch (error) {
        res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
})

router.post("/checkUsername", async (req, res)=>{
    try {
        const username = req.body.username;
        const check = await userCheck.findOne({username : username});
        if(check){
			return res.json({
				status : 0,
				message : `The username "${username}" already exists. Please use a different username`
			})
		}
		return res.json({
			status : 1,
			message : "Valid Username"
		})
    } catch (error) {
        res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
})

router.get("/verifyUser/:id", async (req, res)=>{
    try {
        const id = req.params.id;
        const splitData = id.split("###");
        const userid = splitData[0];
        const veri_code = splitData[1];
        const checkUser = await userCheck.findOne({_id : userid});
        if(checkUser == null){
            return res.json({
                status : 0,
                message : "Sorry You are not a valid user"
            })
        }
        const code = checkUser.verified;
        if(code == veri_code){
            return res.json({
                status : 0,
                message : "Sorry Your Verification Code In Invalid"
            })
        }
        await userCheck.updateOne({_id : userid},{
            $set : {
                verified : true
            }
        })
        return res.json({
            status : 1,
            message : "Verified Successfully"
        })
    } catch (error) {
        res.json({
            status : 0,
            message : `Server Error ${error.toString()}`
        })
    }
})

module.exports = router;

function sendMail(name, email, url) {

    var mail = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        use_authentication: true,
        auth: {
            user: "planfrank2020@gmail.com",
            pass: "planfrank@1",
        },
    });

    var mailOptions = {
        from: "planfrank2020@gmail.com",
        to: email,
        subject: "Account Verification",
        html:`<!DOCTYPE html><html><head><title></title><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge" /><link href="https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400&display=swap" rel="stylesheet"><style type="text/css">@media screen{@font-face{font-family:'Lato';font-style:normal;font-weight:400;src:local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff')}@font-face{font-family:'Lato';font-style:normal;font-weight:700;src:local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff')}@font-face{font-family:'Lato';font-style:italic;font-weight:400;src:local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff')}@font-face{font-family:'Lato';font-style:italic;font-weight:700;src:local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff')}}body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}img{-ms-interpolation-mode:bicubic}img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none}table{border-collapse:collapse !important}body{height:100% !important;margin:0 !important;padding:0 !important;width:100% !important}a[x-apple-data-detectors]{color:inherit !important;text-decoration:none !important;font-size:inherit !important;font-family:inherit !important;font-weight:inherit !important;line-height:inherit !important}@media screen and (max-width:600px){h1{font-size:32px !important;line-height:32px !important}}div[style*="margin: 16px 0;"]{margin:0 !important}</style></head><body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td bgcolor="#F95368" align="center"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td align="center" valign="top" style="padding: 40px 10px 40px 10px;"></td></tr></table></td></tr><tr><td bgcolor="#F95368" align="center" style="padding: 0px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;"><h1 style="font-size: 48px; font-weight: 400; margin: 2;font-family: 'Caveat', cursive; font-family: 'Patrick Hand', cursive;">The plan is on! ${name}</h1> <img src="/logoGif.gif" width="125" height="120" style="display: block; border: 0px;" /></td></tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;font-family: 'Rajdhani', sans-serif;">We’re excited to have you join us. Make a community with people of shared interest. Confirm your account</p></td></tr><tr><td bgcolor="#ffffff" align="left"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;"><table border="0" cellspacing="0" cellpadding="0"><tr><td align="center" style="border-radius: 3px;font-family: 'Rajdhani', sans-serif;" bgcolor="#F95368"><a href="${url}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #F95368; display: inline-block;">Confirm Account</a></td></tr></table></td></tr></table></td></tr><tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;font-family: 'Rajdhani', sans-serif;">If that doesn't work, copy and paste the following link in your browser:</p></td></tr><tr><td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;font-family: 'Rajdhani', sans-serif;"><a href="#" target="_blank" style="color: #F95368;">${url}</a></p></td></tr><tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;font-family: 'Rajdhani', sans-serif;">If you have any questions, just reply to this email—we're always happy to help out.</p></td></tr><tr><td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;"><p style="margin: 0;font-family: 'Rajdhani', sans-serif;">Cheers,<br>PlanFrank Team</p></td></tr></table></td></tr><tr><td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;"><tr><td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;background-color: #ec122e91;"><h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2><p style="margin: 0;"><a href="#" target="_blank" style="color: #ffffff;">We&rsquo;re here to help you out</a></p></td></tr></table></td></tr></table></body></html>`,
    };

    mail.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}