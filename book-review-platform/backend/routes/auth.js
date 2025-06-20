const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    logout, 
    getMe, 
    updateDetails, 
    updatePassword,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes (require authentication)
router.use(authenticate);

router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);
router.get('/logout', logout);

module.exports = router;