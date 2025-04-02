const router = require('express').Router();
const {signup , login} = require('../Controllers/authController');
const {signupValidation , loginValidation} = require('../Middleware/authValidation')
router.post('/login',loginValidation , login);
router.post('/signup', signupValidation , signup);


module.exports = router;