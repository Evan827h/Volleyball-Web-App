const model = require('../models/connection');
const topicModel = require('../models/topics');
const RSVP = require('../models/rsvp');

exports.index = (req, res) => {
    let topics = topicModel.find();
    model.find()
    .then((connections)=> {
        res.render('./connection/connections', {connections, topics});
    })
    .catch(err=>next(err));
};

exports.new = (req, res) => {
    res.render('./connection/newConnection')
};

exports.create = (req, res, next) => {
    let connection = new model(req.body);
    connection.host = req.session.user;
    connection.save()
    .then((connection) => {
        req.flash('success', 'Connection Created');
        res.redirect('/connections');
    })
    .catch(err=> {
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;

    Promise.all([model.findById(id).populate('host', 'firstName lastName'), RSVP.find({connection: id})])
    .then(results=> {
        const [connection, rsvp] = results;
        if(connection) {
            return res.render('./connection/connection', {connection, rsvp});
        } else {
            let err = new Error('Cannot find connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(connection=> {
        return res.render('./connection/editConnection', {connection});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let connection = req.body;
    let id = req.params.id;
    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection => {
        res.redirect('/connections/' + id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    //delete all rsvps to connection
    RSVP.deleteMany({connection: id})
    .catch(err=> {
        next(err)
    });

    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection => {
        res.redirect('/connections');
    })
    .catch(err=> {
        next(err)
    });
};

//todo add after selected stuff
exports.rsvp = (req, res, next) => {
    let id = req.params.id;

    let rsvp = {};
    rsvp.user = req.session.user;
    rsvp.connection = id;
    rsvp.status = req.body.status

    let query = { user: req.session.user };

    RSVP.findOneAndUpdate(query, rsvp, {new: true, upsert: true})
    .then((results) => {
        req.flash('success', 'RSVP\'d as ' + results.status);
        res.redirect('/connections/' + id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError' ) {
            req.flash('error', err.message );
            return res.redirect('back');
        }
        next(err);
    });
};