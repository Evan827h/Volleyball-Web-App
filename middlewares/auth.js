const Connection = require('../models/connection');

//check if user is a guest
exports.isGuest = (req, res, next)=>{
    if(!req.session.user){
        return next();
    }else {
         req.flash('error', 'Currently Logged in');
         return res.redirect('/users/profile');
     }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) =>{
    if(req.session.user){
        return next();
    }else {
         req.flash('error', 'Must be signed-in');
         return res.redirect('/users/login');
     }
};

//check if user is author of the story
exports.isHost = (req, res, next) =>{
    let id = req.params.id;
    Connection.findById(id)
    .then(connection=>{
        if(connection) {
            if(connection.host == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find connection with id ' + req.params.id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err=>next(err));
};
