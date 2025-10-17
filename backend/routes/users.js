// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Todo = require('../models/Todo');

// // GET all users
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find().sort({ createdAt: -1 });
//     res.json({ success: true, data: users });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // CREATE user
// router.post('/', async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json({ success: true, data: user });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// });

// // UPDATE user
// router.put('/:id', async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json({ success: true, data: user });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// });

// // DELETE user
// router.delete('/:id', async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     await Todo.deleteMany({ user: req.params.id });
//     res.json({ success: true, message: 'User deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Todo = require('../models/Todo');

// GET all users with statistics
router.get('/', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    // Get todo statistics for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const todos = await Todo.find({ user: user._id });
        const totalTodos = todos.length;
        const completedTodos = todos.filter(todo => todo.completed).length;
        const pendingTodos = totalTodos - completedTodos;

        return {
          ...user.toObject(),
          stats: {
            totalTodos,
            completedTodos,
            pendingTodos
          }
        };
      })
    );

    res.json({
      success: true,
      message: `🎯 Found ${users.length} users`,
      data: usersWithStats,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single user with detailed stats
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '👤 User not found'
      });
    }

    const todos = await Todo.find({ user: user._id }).sort({ createdAt: -1 });
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    const priorityStats = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length
    };

    const userWithStats = {
      ...user.toObject(),
      stats: {
        totalTodos,
        completedTodos,
        pendingTodos,
        priorityStats,
        completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
      },
      recentTodos: todos.slice(0, 5)
    };

    res.json({
      success: true,
      message: '👤 User details retrieved successfully',
      data: userWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE user
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, avatar, bio } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: '👤 Name and email are required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '📧 User with this email already exists'
      });
    }

    const user = new User({
      name,
      email,
      phone,
      avatar: avatar || '👤',
      bio
    });

    await user.save();
    
    res.status(201).json({
      success: true,
      message: '🎉 User created successfully!',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, avatar, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, avatar, bio },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '👤 User not found'
      });
    }

    res.json({
      success: true,
      message: '✅ User updated successfully!',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: '👤 User not found'
      });
    }

    // Delete all todos associated with this user
    await Todo.deleteMany({ user: req.params.id });

    res.json({
      success: true,
      message: '🗑️ User and all associated todos deleted successfully!',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
