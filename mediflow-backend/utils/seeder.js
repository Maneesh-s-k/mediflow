// utils/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Department = require('../models/department.model');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const departments = [
  {
    name: 'Cardiology',
    capacity: 20,
    currentPatients: 15,
    waitTime: 45,
    staffCount: 5
  },
  {
    name: 'General Medicine',
    capacity: 20,
    currentPatients: 12,
    waitTime: 30,
    staffCount: 4
  },
  {
    name: 'Pediatrics',
    capacity: 20,
    currentPatients: 9,
    waitTime: 20,
    staffCount: 3
  },
  {
    name: 'Orthopedics',
    capacity: 20,
    currentPatients: 6,
    waitTime: 15,
    staffCount: 2
  },
  {
    name: 'Neurology',
    capacity: 20,
    currentPatients: 10,
    waitTime: 25,
    staffCount: 3
  },
  {
    name: 'Emergency',
    capacity: 20,
    currentPatients: 17,
    waitTime: 60,
    staffCount: 6
  }
];

const users = [
  {
    name: 'Dr. Sarah Chen',
    email: 'doctor@mediflow.com',
    password: 'password123',
    role: 'Doctor',
    department: 'Cardiology',
    specialty: 'Interventional Cardiology',
    status: 'active'
  },
  {
    name: 'Admin User',
    email: 'admin@mediflow.com',
    password: 'admin123',
    role: 'Admin',
    department: 'General Medicine',
    status: 'active'
  }
];

// Import data into DB
const importData = async () => {
  try {
    await Department.deleteMany();
    await User.deleteMany();

    await Department.insertMany(departments);
    await User.create(users);

    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete data from DB
const deleteData = async () => {
  try {
    await Department.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed...');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Check command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please add proper command: -i (import) or -d (delete)');
  process.exit();
}
