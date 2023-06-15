const express = require('express');

const router = express.Router();
const authController = require('../../controllers/authController');
const validateBody = require('../../utils/validateBody');
const { userRegisterSchema, userLoginSchema, emailSchema } = require('../../models/user');
const authenticate = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');

router.post('/register', validateBody(userRegisterSchema), authController.register);

router.get('/verify/:verificationToken', authController.verify);

router.post('/verify', validateBody(emailSchema), authController.resendVerifyEmail);

router.post('/login', validateBody(userLoginSchema), authController.login);

router.get('/current', authenticate, authController.getCurrent);

router.post('/logout', authenticate, authController.logout);

router.patch('/avatars', authenticate, upload.single('avatar'), authController.updateAvatar)

module.exports = router;