// mediflow-backend/utils/seeder.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Department = require('../models/department.model');
const User = require('../models/user.model');
const Patient = require('../models/patient.model');
const Inventory = require('../models/inventory.model');

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
    staffCount: 5,
    status: 'Medium'
  },
  {
    name: 'General Medicine',
    capacity: 20,
    currentPatients: 12,
    waitTime: 30,
    staffCount: 4,
    status: 'Normal'
  },
  {
    name: 'Pediatrics',
    capacity: 20,
    currentPatients: 9,
    waitTime: 20,
    staffCount: 3,
    status: 'Normal'
  },
  {
    name: 'Orthopedics',
    capacity: 20,
    currentPatients: 6,
    waitTime: 15,
    staffCount: 2,
    status: 'Normal'
  },
  {
    name: 'Neurology',
    capacity: 20,
    currentPatients: 10,
    waitTime: 25,
    staffCount: 3,
    status: 'Normal'
  },
  {
    name: 'Emergency',
    capacity: 20,
    currentPatients: 17,
    waitTime: 60,
    staffCount: 6,
    status: 'High'
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
  },
  {
    name: 'Nurse Wilson',
    email: 'nurse@mediflow.com',
    password: 'nurse123',
    role: 'Nurse',
    department: 'Emergency',
    status: 'active'
  }
];

// Sample patients for the queue
const patients = [
  {
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    contact: '555-1234',
    email: 'john@example.com',
    department: 'Cardiology',
    urgencyLevel: 2,
    symptoms: 'Chest pain, shortness of breath',
    token: 'A1001',
    estimatedWaitTime: 25,
    status: 'Waiting',
    arrivalTime: new Date()
  },
  {
    name: 'Jane Smith',
    age: 35,
    gender: 'Female',
    contact: '555-5678',
    email: 'jane@example.com',
    department: 'General Medicine',
    urgencyLevel: 1,
    symptoms: 'Fever, headache',
    token: 'A1002',
    estimatedWaitTime: 40,
    status: 'Waiting',
    arrivalTime: new Date(Date.now() - 15 * 60000) // 15 minutes ago
  },
  {
    name: 'Robert Johnson',
    age: 65,
    gender: 'Male',
    contact: '555-9012',
    email: 'robert@example.com',
    department: 'Cardiology',
    urgencyLevel: 3,
    symptoms: 'Severe chest pain, dizziness',
    token: 'A1003',
    estimatedWaitTime: 15,
    status: 'InService',
    arrivalTime: new Date(Date.now() - 30 * 60000) // 30 minutes ago
  }
];

// Sample inventory items
const inventoryItems = [
  {
    name: 'Surgical Masks',
    category: 'Supplies',
    stock: 500,
    minStock: 100,
    unit: 'pieces',
    status: 'ok'
  },
  {
    name: 'Paracetamol',
    category: 'Medication',
    stock: 50,
    minStock: 100,
    unit: 'boxes',
    status: 'low'
  },
  {
    name: 'Antibiotics',
    category: 'Medication',
    stock: 10,
    minStock: 50,
    unit: 'boxes',
    status: 'critical'
  },
  {
    name: 'Syringes',
    category: 'Supplies',
    stock: 200,
    minStock: 150,
    unit: 'pieces',
    status: 'ok'
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await Department.deleteMany();
    await User.deleteMany();
    await Patient.deleteMany();
    await Inventory.deleteMany();

    // Insert new data
    await Department.insertMany(departments);
    await User.create(users);
    await Patient.insertMany(patients);
    await Inventory.insertMany(inventoryItems);

    console.log('Data Imported Successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Delete all data
const deleteData = async () => {
  try {
    await Department.deleteMany();
    await User.deleteMany();
    await Patient.deleteMany();
    await Inventory.deleteMany();

    console.log('Data Destroyed');
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
