const express = require('express');
const controller = require('../controllers/connectionController')
const {isLoggedIn, isHost} = require('../middlewares/auth');
const {validateId, validateConnection, validateResults, validateRSVP} = require('../middlewares/validator');

const router = express.Router();

//get /connections
router.get('/', controller.index);

//render new connection page
router.get('/new', isLoggedIn, controller.new);

//create new connection
router.post('/', isLoggedIn, validateConnection, validateResults, controller.create);

//get /connection/:id  show connection
router.get('/:id', validateId, controller.show);

//render edit connection
router.get('/:id/edit', validateId, isLoggedIn, isHost, controller.edit);

//update connection
router.put('/:id', validateId, isLoggedIn, isHost, validateConnection, validateResults, controller.update);

//delete connection
router.delete('/:id', validateId, isLoggedIn, isHost, controller.delete);

router.post('/:id/rsvp', isLoggedIn, validateRSVP, validateResults, controller.rsvp);

module.exports = router;