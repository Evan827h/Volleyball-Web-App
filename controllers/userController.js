const model = require('../models/user');
const Connection = require('../models/connection');
const RSVP = require('../models/rsvp');

//account creation page
exports.new = (req, res)=>{
        return res.render('./user/new');
};

//user registration
exports.create = (req, res, next)=>{

    let user = new model(req.body);
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
    .then(user=> {
        req.flash('success', 'Registration Complete');
        res.redirect('/users/login');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);  
            return res.redirect('back');
        }

        if(err.code === 11000) {
            req.flash('error', 'Email is already in use.');  
            return res.redirect('back');
        }
        next(err);
    }); 
    
};

//login page
exports.getUserLogin = (req, res, next) => {
        return res.render('./user/login');
}

//login authentication
exports.login = (req, res, next)=>{
    let email = req.body.email;
    if(email)
        email = email.toLowerCase();
    let password = req.body.password;
    model.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Incorrect email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = user._id;
                    req.flash('success', 'Successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'Incorrect password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
};

//render profile page
exports.profile = (req, res, next)=>{
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({host: id}), RSVP.find({user: id}).populate('connection', '_id name topic')])
    .then(results=>{
        const [user, connection, rsvp] = results;
        res.render('./user/profile', {user, connection, rsvp});
    })
    .catch(err=>next(err));
};

//logout user
exports.logout = (req, res, next)=>{
    req.session.destroy(err=>{
        if(err) 
           return next(err);
       else
            res.redirect('/');  
    });
   
 };



