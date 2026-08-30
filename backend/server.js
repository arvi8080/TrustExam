const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: __dirname + '/.env' });


const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin-fixed');
const studentRoutes = require('./routes/student');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serverless Database Connection Handler
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error('CRITICAL: MONGO_URI environment variable is not defined!');
    throw new Error('Database connection error: MONGO_URI environment variable is missing.');
  }

  try {
    await mongoose.connect(mongoUri, {
      bufferCommands: false, // Fail fast if disconnected instead of timing out after 10s
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw new Error(`Database connection failed: ${err.message}`);
  }
};

// Ensure Database is connected before serving requests
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api')) {
    try {
      await connectDB();
    } catch (dbErr) {
      return res.status(500).json({ message: dbErr.message });
    }
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
}

module.exports = app;
