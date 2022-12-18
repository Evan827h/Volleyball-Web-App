const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiter');
const {validateSignUp, validateLogIn, validateResults} = require('../middlewares/validator');

const router = express.Router();

//GET /users/new  new user account
router.get('/new', isGuest, controller.new);

//POST /users create new user
router.post('/', isGuest, validateSignUp, validateResults, controller.create);

//GET /users/login user login page
router.get('/login', isGuest, controller.getUserLogin);

//POST /users/login login user
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResults, controller.login);

//GET /users/profile load profile page
router.get('/profile', isLoggedIn, controller.profile);

//POST /users/logout logout user
router.get('/logout', isLoggedIn, controller.logout);

module.exports = router;