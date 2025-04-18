const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Sample data (in a real app, this would come from a database)
let hospitalData = {
    patientQueue: {
        count: 15,
        avgWaitTime: 25
    },
    bedStatus: {
        available: 45,
        total: 200,
        occupancyRate: 77.5
    },
    inventory: {
        lowStock: 8,
        critical: 3
    }
};

// Store patient queue data
let patientQueueData = [];

// Route to handle the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Route to get all hospital data
app.get('/api/dashboard', (req, res) => {
    res.json(hospitalData);
});

// Route to update patient queue
app.post('/api/patient-queue', (req, res) => {
    if (req.body.count !== undefined) {
        hospitalData.patientQueue.count = req.body.count;
    }
    if (req.body.avgWaitTime !== undefined) {
        hospitalData.patientQueue.avgWaitTime = req.body.avgWaitTime;
    }
    res.json(hospitalData.patientQueue);
});

// Route to get all patients in queue
app.get('/api/patient-queue/all', (req, res) => {
    res.json(patientQueueData);
});

// Route to add a patient to the queue
app.post('/api/patient-queue/add', (req, res) => {
    const newPatient = req.body;
    
    // Validate required fields
    if (!newPatient.name || !newPatient.department) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Add to queue
    patientQueueData.push(newPatient);
    
    // Update dashboard count
    hospitalData.patientQueue.count = patientQueueData.length;
    
    res.status(201).json(newPatient);
});

// Route to remove a patient from the queue
app.delete('/api/patient-queue/:id', (req, res) => {
    const patientId = parseInt(req.params.id);
    
    // Find and remove patient
    const index = patientQueueData.findIndex(p => p.id === patientId);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Patient not found' });
    }
    
    // Remove from queue
    const removedPatient = patientQueueData.splice(index, 1)[0];
    
    // Update dashboard count
    hospitalData.patientQueue.count = patientQueueData.length;
    
    res.json(removedPatient);
});

// Route to update bed status
app.post('/api/bed-status', (req, res) => {
    if (req.body.available !== undefined) {
        hospitalData.bedStatus.available = req.body.available;
    }
    if (req.body.occupancyRate !== undefined) {
        hospitalData.bedStatus.occupancyRate = req.body.occupancyRate;
    }
    res.json(hospitalData.bedStatus);
});

// Route to update inventory
app.post('/api/inventory', (req, res) => {
    if (req.body.lowStock !== undefined) {
        hospitalData.inventory.lowStock = req.body.lowStock;
    }
    if (req.body.critical !== undefined) {
        hospitalData.inventory.critical = req.body.critical;
    }
    res.json(hospitalData.inventory);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


// Route to add a patient to the queue with vitals and triage data
app.post('/api/patient-queue/add', (req, res) => {
    const newPatient = req.body;
    
    // Validate required fields
    if (!newPatient.name || !newPatient.department) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Add to queue
    patientQueueData.push(newPatient);
    
    // Update dashboard count
    hospitalData.patientQueue.count = patientQueueData.length;
    
    // Calculate average wait time
    const totalWaitTime = patientQueueData.reduce((sum, patient) => sum + patient.estimatedWaitTime, 0);
    const avgWaitTime = patientQueueData.length > 0 ? Math.round(totalWaitTime / patientQueueData.length) : 0;
    hospitalData.patientQueue.avgWaitTime = avgWaitTime;
    
    res.status(201).json(newPatient);
});

