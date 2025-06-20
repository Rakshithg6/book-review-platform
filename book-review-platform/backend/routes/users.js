const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', userController.getUserProfile);

// @route   PUT api/users/:id
// @desc    Update user profile
// @access  Private
router.put(
  '/:id',
  [
    auth.authenticate,
    [
      check('username', 'Username is required').optional().not().isEmpty(),
      check('email', 'Please include a valid email').optional().isEmail(),
      check('currentPassword', 'Current password is required with newPassword').if(
        (_, { req }) => req.body.newPassword
      ).notEmpty(),
      check('newPassword', 'New password must be at least 6 characters').if(
        (_, { req }) => req.body.newPassword
      ).isLength({ min: 6 }),
      check('firstName', 'First name is required').optional().not().isEmpty(),
      check('lastName', 'Last name is required').optional().not().isEmpty()
    ]
  ],
  userController.updateUserProfile
);

// @route   DELETE api/users/:id
// @desc    Delete user account
// @access  Private
router.delete(
  '/:id',
  auth.authenticate,
  userController.deleteUserAccount
);

// @route   GET api/users/:id/reviews
// @desc    Get user's reviews
// @access  Public
router.get(
  '/:id/reviews',
  [
    check('page', 'Page number must be a positive integer').optional().isInt({ min: 1 }),
    check('limit', 'Limit must be a positive integer').optional().isInt({ min: 1 })
  ],
  userController.getUserReviews
);

module.exports = router;
