// const express = require('express');
// const router = express.Router();
// const Todo = require('../models/Todo');

// // GET todos for user
// router.get('/user/:userId', async (req, res) => {
//   try {
//     const todos = await Todo.find({ user: req.params.userId }).populate('user');
//     res.json({ success: true, data: todos });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// // CREATE todo
// router.post('/', async (req, res) => {
//   try {
//     const todo = new Todo(req.body);
//     await todo.save();
//     await todo.populate('user');
//     res.status(201).json({ success: true, data: todo });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// });

// // UPDATE todo
// router.put('/:id', async (req, res) => {
//   try {
//     const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user');
//     res.json({ success: true, data: todo });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// });

// // DELETE todo
// router.delete('/:id', async (req, res) => {
//   try {
//     await Todo.findByIdAndDelete(req.params.id);
//     res.json({ success: true, message: 'Todo deleted' });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// GET all todos for a user with filtering
router.get('/user/:userId', async (req, res) => {
  try {
    const { completed, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = { user: req.params.userId };
    
    // Apply filters
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const todos = await Todo.find(filter)
      .populate('user', 'name email avatar')
      .sort(sortConfig);

    res.json({
      success: true,
      message: `📝 Found ${todos.length} todos`,
      data: todos,
      count: todos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).populate('user', 'name email avatar');
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: '📝 Todo not found'
      });
    }
    
    res.json({
      success: true,
      message: '📝 Todo retrieved successfully',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// CREATE todo
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags, user } = req.body;
    
    if (!title || !user) {
      return res.status(400).json({
        success: false,
        error: '📝 Title and user are required'
      });
    }

    const todo = new Todo({
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      tags: tags || [],
      user
    });

    await todo.save();
    await todo.populate('user', 'name email avatar');
    
    res.status(201).json({
      success: true,
      message: '🎉 Todo created successfully!',
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// UPDATE todo
router.put('/:id', async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed, tags } = req.body;
    
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        priority, 
        dueDate: dueDate ? new Date(dueDate) : undefined,
        completed,
        tags: tags || []
      },
      { new: true, runValidators: true }
    ).populate('user', 'name email avatar');

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: '📝 Todo not found'
      });
    }

    res.json({
      success: true,
      message: '✅ Todo updated successfully!',
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: '📝 Todo not found'
      });
    }

    res.json({
      success: true,
      message: '🗑️ Todo deleted successfully!',
      data: todo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// TOGGLE todo completion
router.patch('/:id/toggle', async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        error: '📝 Todo not found'
      });
    }

    todo.completed = !todo.completed;
    await todo.save();
    await todo.populate('user', 'name email avatar');

    res.json({
      success: true,
      message: `✅ Todo marked as ${todo.completed ? 'completed' : 'incomplete'}!`,
      data: todo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

// GET todo statistics for a user
router.get('/user/:userId/stats', async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.params.userId });
    
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const pendingTodos = totalTodos - completedTodos;

    const priorityStats = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length
    };

    const overdueTodos = todos.filter(todo => 
      todo.dueDate && new Date() > todo.dueDate && !todo.completed
    ).length;

    res.json({
      success: true,
      message: '📊 Todo statistics retrieved successfully',
      data: {
        totalTodos,
        completedTodos,
        pendingTodos,
        overdueTodos,
        priorityStats,
        completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;