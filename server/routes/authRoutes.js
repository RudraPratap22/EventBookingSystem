const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleAuthCallback);
router.get('/success', authController.authSuccess);
router.get('/failure', authController.authFailure);
router.get('/logout', authController.logout);

module.exports = router;