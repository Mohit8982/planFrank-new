const { body, validationResult } = require('express-validator')

const resgitrationVali = () => {
    return [
      body('username', 'Username Cannot Be Empty').not().isEmpty(),
      body('email').not().isEmpty().withMessage('Email Cannot Be Empty').isEmail().withMessage('Invalid Email'),
      body('name', 'Name Cannot Be Empty').not().isEmpty(),
      body('password', 'Password Cannot Be Empty').not().isEmpty(),
      body('mobile', 'Mobile Number Cannot Be Empty').not().isEmpty(),
    ]
}

const loginVali = () => {
    return [
      body('username', 'Username Cannot Be Empty').not().isEmpty(),
      body('password', 'Password Cannot Be Empty').not().isEmpty(),
    ]
}

const createPlan = () =>{
    return[
        body('title', 'Plan Title Cannot Be Empty').not().isEmpty(),
        body('planTimestart', 'Plan Start Time Cannot Be Empty').not().isEmpty(),
        body('planTimeend', 'Plan End Time Cannot Be Empty').not().isEmpty(),
        body('planDate', 'Plan Date Cannot Be Empty').not().isEmpty(),
        body('planLocation', 'Plan Location Cannot Be Empty').not().isEmpty(),
        body('planCategory', 'Select any One Plan Category').not().isEmpty(),
    ]
}


const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }

    let errNEW = errors.errors
    let custArr = {}

    for(index in errNEW){
        let keyname = errNEW[index].param
        let msgNew = errNEW[index].msg
        custArr[keyname]  = msgNew
    }

    return res.status(200).json({
        status: 3,
        errors: custArr,
    })
}

module.exports = { resgitrationVali, loginVali, createPlan, validate }