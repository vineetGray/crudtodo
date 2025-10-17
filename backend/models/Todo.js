// const mongoose = require('mongoose');

// const todoSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   completed: { type: Boolean, default: false },
//   priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
//   dueDate: { type: Date },
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
// }, { timestamps: true });

// module.exports = mongoose.model('Todo', todoSchema);

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '📝 Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high'],
      message: 'Priority must be low, medium, or high'
    },
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  }
}, {
  timestamps: true
});

// Index for better performance
todoSchema.index({ user: 1, createdAt: -1 });
todoSchema.index({ dueDate: 1 });
todoSchema.index({ priority: 1 });

// Virtual for todo status
todoSchema.virtual('status').get(function() {
  if (this.completed) return 'completed';
  if (this.dueDate && new Date() > this.dueDate) return 'overdue';
  return 'pending';
});

// Virtual for days until due
todoSchema.virtual('daysUntilDue').get(function() {
  if (!this.dueDate) return null;
  const today = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Todo', todoSchema);