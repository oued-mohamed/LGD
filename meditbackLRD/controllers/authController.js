const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { MESSAGES, STATUS_CODES } = require('../utils/constants'); // ✅ ADDED IMPORT

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.EMAIL_ALREADY_EXISTS // ✅ UPDATED
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.emailVerificationToken = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex');
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // OPTIONAL: send verification email
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    /*
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - MeditFront',
      message: `Please verify your email by clicking: ${verificationUrl}`
    });
    */

    // ✅ NEW: Auto-login by generating token
    const token = user.getSignedJwtToken();

    // ✅ Send response compatible with frontend expectations
    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: MESSAGES.USER_CREATED, // ✅ UPDATED
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.SERVER_ERROR // ✅ UPDATED
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        success: false,
        message: 'Please provide an email and password' // ✅ KEPT: Not in constants yet
      });
    }

    // Check for user (include password for comparison)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.INVALID_CREDENTIALS // ✅ UPDATED
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(STATUS_CODES.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.INVALID_CREDENTIALS // ✅ UPDATED
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send token response
    sendTokenResponse(user, STATUS_CODES.OK, res); // ✅ UPDATED

  } catch (error) {
    console.error('Login error:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.SERVER_ERROR // ✅ UPDATED
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(STATUS_CODES.OK).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: MESSAGES.SERVER_ERROR // ✅ UPDATED
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(STATUS_CODES.OK).json({
    success: true,
    message: MESSAGES.LOGOUT_SUCCESS // ✅ UPDATED
  });
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      accessToken: token,      
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
};

module.exports = {
  register,
  login,
  getMe,
  logout
};