const express = require('express');
const router = express.Router();

const { Create_Post } = require('../Controller/Post');
const { auth_permission } = require('../Middleware/Auth');

router.route('/Create_Post').post(auth_permission, Create_Post);

module.exports = router;
