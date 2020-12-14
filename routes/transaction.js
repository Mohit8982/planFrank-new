const router = require("express").Router();
const userCheck = require("../model/User");
const tranSchema = require("../model/Transaction");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const path = require("path");
const session = require('../helper/session');
const { registrationVali, loginVali, profile_edit, validate } = require('../helper/validation');
const multer = require("multer");


const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post("/upload", async (req, res)=>{
    
         upload(req, res, async (err) => {
            if(err){
                return res.json({
                    status: 0,
                    message: `Error in uploading Image : ${err.toString()}`
                });
            } else {
            if(req.file == undefined){
                return res.json({
                    status: 0,
                    message: 'No Profile Image Selected'
                });
            } else {
                try {
                    const { username, password, mobile, email, city } = req.body;
                    const checkUser = await userCheck.findOne({username : username},{_id : 1});
                    if(checkUser){
                        return res.json({
                            status : 0,
                            message : "Username Already Taken...!!!!"
                        })
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);
                    const currentTime = moment().format("DD/MM/YYYY hh:mm:ss a");
                    const register = new userCheck({
                        username : username, 
                        mobile: mobile,
                        email: email,
                        city: city,
                        hashed_password: hashedPassword,
                        created: currentTime,
                        img_path: `uploads/${req.file.filename}`
                    });

                    await register.save();
                    
                    return res.json({
                        status : 1,
                        message : `Hello ${username}, You are registered successfully`
                    })
                }  catch (error) {
                    return res.json({
                        status : 0,
                        message :`${error.toString()}`
                    })
                }                   
            }
        }
    });
});

router.get("/", async (req, res) => {
    try {
        res.render("./login")
    } catch (error) {
        return res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
})

router.get("/register", async (req, res) => {
    try {
        res.render("./register")
    } catch (error) {
        return res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
})

router.get("/index", session, async (req, res) => {
    try {
         const details = req.session.details;
         res.render("./index", {userData  :details})
    } catch (error) {
        return res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
})

router.post("/authLogin", loginVali(), validate, async (req, res)=>{
    try {
        const { username, password } = req.body;
        const Check_user = await userCheck.findOne({username : username});
        if (Check_user === null) {
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

        const token = jwt.sign(
            { key: Check_user._id },
            process.env.jsonSecretToken
        );

        let details = {
            userId: Check_user._id,
            username: Check_user.username,
        };
        
        req.session.details = details;
        req.session.token = token;

        return res.json({
            status : 1,
            message : "Success",
            userData: details,
            url : "/index"
        })
    } catch (error) {
        return res.json({
            status : 0,
            message :`Server Error : ${error.toString()}`
        })
    }
})

router.get('/logout', session, async (req, res) => {
    try {
        req.session.destroy(function (err) {
            return res.redirect('/')
        })
    } catch (e) {
        res.json({ status: 0, message: `Server Error : ${e.toString()}` });
    }
});

router.post('/delete', session, async (req, res) => {
    try {
        const details = req.session.details;
        const curr_id = details.userId
        const { id } = req.body;;
        if (id !== curr_id) {
            await userCheck.deleteOne({ _id: id });
            return res.json({
                status: 1,
                message : "user deleted Successfully"
            })
        } 

        return res.json({
            status: 0,
            message : "You cannot delete yourself"
        })

    } catch (e) {
        return res.json({ status: 0, message: `Server Error : ${e.toString()}` });
    }
});

router.post("/userAjax", function (req, res) {
    let i = parseInt(req.body.start) + 1;
    userCheck.dataTables({
        limit: req.body.length,
        skip: req.body.start,
        order: req.body.order,
        columns: req.body.columns,
        search: {
            value: req.body.search.value,
            fields: ["username", "mobile", "email"],
        },
        sort: {_id: 1, username: 1, mobile: 1, email: 1,},
    })
    .then(function (table) {
        let dataTab = table.data;
        let tabelArray = [];
        for (index in dataTab) {

            let { username, mobile, email, _id } = dataTab[index];

            let dataJson = {
                _id: i,
                username: username,
                mobile: mobile,
                email : email,
                edit: ` <button class="btn btn-primary btn-user btn-block" data-toggle="modal" data-target="#logoutModal" onclick="edit('${username}', '${mobile}', '${email}', '${_id}')" value="submit">Edit</button>`,
                delete: `<button class="btn btn-primary btn-user btn-block" onclick="deleteUser('${_id}')" value="submit">Delete</button>`,
            };
            tabelArray.push(dataJson);
            i++;
        }
        return res.json({
            data: tabelArray,
            recordsFiltered: table.total,
            recordsTotal: table.total,
        });
    })
    .catch(function (error) {
        res.json({
            status: 0,
            message: "Request To Large",
        });
    });	
});

router.post('/updateUser', session, profile_edit(), validate, async (req, res) => {
    try {
        const details = req.session.details;
        const curr_id = details.userId
        const { id, username, email, mobile } = req.body;;
        if (id !== curr_id) {
            return res.json({
                status: 0,
                message : "You Can only edit your profile"
            })
        } 

        await userCheck.updateOne({ _id: id }, {
            $set: {
                username: username,
                email: email,
                mobile: mobile
            }
        })

        return res.json({
            status: 1,
            message : "Profile Updated Successfully"
        })
    } catch (e) {
        return res.json({ status: 0, message: `Server Error : ${e.toString()}` });
    }
});

router.post('/transaction', async (req, res) => {
    const session = await userCheck.startSession();
    session.startTransaction();
    console.log(session)
    try {
        const { userId, amount } = req.body;
        const opts = { session };
        const A = await userCheck.findOneAndUpdate(
            { _id: userId }, { $inc: { wallet_amt: amount } },{upsert : false, new: true}, opts);

        const B = await tranSchema(
                        { user_id: userId, amt_added: amount, reqType : "Credit" })
                        .save(opts);
        await session.commitTransaction();
        session.endSession();
        return res.json({
            status : 1
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.json({status : 0, message : error.toString()})
    } 
})

module.exports = router;
