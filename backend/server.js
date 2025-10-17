const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Debug: Check if environment variables are loaded
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Port:', process.env.PORT);

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Users route (we'll create this next)
app.use('/api/users', require('./routes/users'));

// Todos route (we'll create this next)
app.use('/api/todos', require('./routes/todos'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
