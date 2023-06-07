const express = require('express');

const router = express.Router();
const authController = require('../../controllers/authController');
const validateBody = require('../../utils/validateBody');
const { userRegisterSchema, userLoginSchema } = require('../../models/user');
const authenticate = require('../../middlewares/authenticate');

router.post('/register', validateBody(userRegisterSchema), authController.register);

router.post('/login', validateBody(userLoginSchema), authController.login);

router.get('/current', authenticate, authController.getCurrent);

router.post('/logout', authenticate, authController.logout);

module.exports = router;