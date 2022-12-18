const {body} = require('express-validator');
const {validationResult} = require("express-validator");

exports.validateId = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid connection id');
        err.status = 400;
        return next(err);
    } else {
        return next();
    }
};

exports.validateSignUp = [
    body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateLogIn = [
    body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})
];

exports.validateResults = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=> {
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

exports.validateConnection = [
        body('name', 'Name cannot be empty or longer than 24 characters').isLength({max: 24}).notEmpty().trim().escape(),
        body('details', 'Details must be at least 10 characters long').isLength({min: 10}).trim().escape(),
        body('date', 'date cannot be empty').notEmpty().trim().escape().isDate(),
        body('date', 'date must be after the current date').isAfter().isDate(),
        body('startTime', 'Start Time cannot be empty').notEmpty().trim().escape(),
        body('endTime', 'End Time cannot be empty').notEmpty().trim().escape(),
        body('endTime', 'End time cannot be before the start time').custom((value, { req }) => {
            var start = new Date("April 04, 2001 " + req.body.startTime + ":00");
            var end = new Date("April 04, 2001 " + value + ":00");
            if (end <= start) {
              throw new Error('End time cannot be before the start time');
            }
            return true;
          }),
        body('location', 'location cannot be empty').notEmpty().trim().escape(),
        body('img', 'Image must be a valid URL').notEmpty().trim().isURL(),
    ];

    exports.validateRSVP = [
        body('status', 'Invalid Response').notEmpty().trim().escape().isIn(['yes', 'no', 'maybe']),
    ];