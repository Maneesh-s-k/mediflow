// mediflow-backend/server.js

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // if you use cookies/auth headers
  }));
const connectDB = require('./config/db');

require('dotenv').config();

// Connect to MongoDB
connectDB();



// Middleware

app.use(express.json());

// Import routes

const departmentRoutes = require('./routes/department.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
// Import other routes as needed

// Mount routes

//app.use('/api/queue', require('./routes/queue.routes'));
app.use('/api/patients', require('./routes/patient.routes'));
app.use('/api/departments', departmentRoutes);
app.use('/api/dashboard', dashboardRoutes);
// Mount other routes as needed

// Basic route
app.get('/', (req, res) => {
  res.send('MEDIFLOW API is running...');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});





const PORT = process.env.PORT || 5050;



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
