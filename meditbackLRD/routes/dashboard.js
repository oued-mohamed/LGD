const express = require('express');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get dashboard data
// @route   GET /api/dashboard
// @access  Private
router.get('/', async (req, res) => {
  try {
    // Sample dashboard data - you can expand this based on your needs
    const dashboardData = {
      user: {
        name: `${req.user.firstName} ${req.user.lastName}`,
        email: req.user.email,
        role: req.user.role,
        lastLogin: req.user.lastLogin
      },
      stats: {
        totalAppointments: 0,
        upcomingAppointments: 0,
        totalRecords: 0,
        lastUpdate: new Date()
      },
      recentActivity: [
        {
          id: 1,
          type: 'login',
          description: 'User logged in',
          timestamp: new Date()
        }
      ]
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/dashboard/stats
// @access  Private
router.get('/stats', async (req, res) => {
  try {
    // You can add more complex statistics here
    const stats = {
      registrationDate: req.user.createdAt,
      profileCompleteness: 75, // Calculate based on filled fields
      accountStatus: req.user.isActive ? 'Active' : 'Inactive',
      emailVerified: req.user.isEmailVerified
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;