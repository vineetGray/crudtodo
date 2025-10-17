// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();

// // Debug: Check if environment variables are loaded
// console.log('MongoDB URI:', process.env.MONGODB_URI);
// console.log('Port:', process.env.PORT);

// // Connect to MongoDB
// const connectDB = async () => {
//   try {
//     if (!process.env.MONGODB_URI) {
//       throw new Error('MONGODB_URI is not defined in environment variables');
//     }
    
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('✅ MongoDB Connected Successfully');
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error.message);
//     process.exit(1);
//   }
// };

// connectDB();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Basic route for testing
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'Server is running!',
//     database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
//   });
// });

// // Users route (we'll create this next)
// app.use('/api/users', require('./routes/users'));

// // Todos route (we'll create this next)
// app.use('/api/todos', require('./routes/todos'));

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
// });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/users');
const todoRoutes = require('./routes/todos');

const app = express();

// MongoDB connection with fallback for local development
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_multi_user';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('💡 Tip: Make sure to set MONGODB_URI environment variable');
  });

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-app-name.netlify.app' // Replace with your actual Netlify URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: '🚀 Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: '🔍 API endpoint not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong on the server!' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌈 Server running on port ${PORT}`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
});