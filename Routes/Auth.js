const express = require('express');
const router = express.Router();

const { SignUp, SignIn } = require('../Controller/Auth');

router.route('/Signup').post(SignUp);
router.route('/SignIn').post(SignIn);

module.exports = router;
