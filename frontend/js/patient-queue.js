document.addEventListener('DOMContentLoaded', function() {
    // API endpoint
    const API_URL = 'http://localhost:3000/api';
    
    // Store the queue data
    let patientQueue = [];
    let currentPatient = null;
    let tokenCounter = 1000; // Starting token number
    
    // DOM elements
    const addPatientForm = document.getElementById('addPatientForm');
    const queueTableBody = document.getElementById('queueTableBody');
    const totalPatientsElement = document.getElementById('totalPatients');
    const waitingPatientsElement = document.getElementById('waitingPatients');
    const avgWaitTimeElement = document.getElementById('avgWaitTime');
    const callNextPatientButton = document.getElementById('callNextPatient');
    const noPatientServing = document.getElementById('noPatientServing');
    const currentPatientServing = document.getElementById('currentPatientServing');
    const completeServiceButton = document.getElementById('completeService');
    const cancelServiceButton = document.getElementById('cancelService');
    
    // Initialize the queue
    initializeQueue();
    
    // Event listeners
    addPatientForm.addEventListener('submit', handleAddPatient);
    callNextPatientButton.addEventListener('click', callNextPatient);
    completeServiceButton.addEventListener('click', completeService);
    cancelServiceButton.addEventListener('click', cancelService);
    
    // Functions
    
    // Initialize the queue data
    async function initializeQueue() {
        try {
            const response = await fetch(`${API_URL}/patient-queue/all`);
            if (response.ok) {
                patientQueue = await response.json();
                updateQueueDisplay();
            } else {
                // For demo purposes, initialize with sample data if API fails
                initializeWithSampleData();
            }
        } catch (error) {
            console.error('Error fetching queue data:', error);
            // For demo purposes, initialize with sample data if API fails
            initializeWithSampleData();
        }
    }
    
    // Initialize with sample data for demonstration
    function initializeWithSampleData() {
        const currentTime = new Date();
        
        patientQueue = [
            {
                id: 1,
                token: "A1001",
                name: "John Smith",
                age: 45,
                gender: "Male",
                department: "Cardiology",
                urgencyLevel: 3,
                symptoms: "Chest pain, shortness of breath",
                vitals: {
                    bloodPressure: "140/90",
                    temperature: "98.6",
                    heartRate: "88",
                    oxygenSaturation: "96"
                },
                arrivalTime: new Date(currentTime - 35 * 60000), // 35 minutes ago
                estimatedWaitTime: 15
            },
            {
                id: 2,
                token: "A1002",
                name: "Sarah Johnson",
                age: 32,
                gender: "Female",
                department: "General Medicine",
                urgencyLevel: 2,
                symptoms: "Fever, sore throat",
                vitals: {
                    bloodPressure: "120/80",
                    temperature: "100.4",
                    heartRate: "76",
                    oxygenSaturation: "98"
                },
                arrivalTime: new Date(currentTime - 25 * 60000), // 25 minutes ago
                estimatedWaitTime: 30
            },
            {
                id: 3,
                token: "A1003",
                name: "Robert Chen",
                age: 68,
                gender: "Male",
                department: "Orthopedics",
                urgencyLevel: 2,
                symptoms: "Back pain, difficulty walking",
                vitals: {
                    bloodPressure: "135/85",
                    temperature: "98.2",
                    heartRate: "72",
                    oxygenSaturation: "97"
                },
                arrivalTime: new Date(currentTime - 15 * 60000), // 15 minutes ago
                estimatedWaitTime: 45
            }
        ];
        
        tokenCounter = 1004; // Set the next token number
        updateQueueDisplay();
    }
    
    // Handle adding a new patient to the queue
    function handleAddPatient(event) {
        event.preventDefault();
        
        // Generate a new token
        const token = `A${tokenCounter++}`;
        
        // Get form values
        const name = document.getElementById('patientName').value;
        const age = document.getElementById('patientAge').value;
        const gender = document.getElementById('patientGender').value;
        const department = document.getElementById('department').value;
        const urgencyLevel = parseInt(document.getElementById('urgencyLevel').value);
        const symptoms = document.getElementById('symptoms').value;
        
        // Get vitals
        const bloodPressure = document.getElementById('bloodPressure').value;
        const temperature = document.getElementById('temperature').value;
        const heartRate = document.getElementById('heartRate').value;
        const oxygenSaturation = document.getElementById('oxygenSaturation').value;
        
        // Create new patient object
        const newPatient = {
            id: Date.now(), // Use timestamp as ID
            token,
            name,
            age,
            gender,
            department,
            urgencyLevel,
            symptoms,
            vitals: {
                bloodPressure,
                temperature,
                heartRate,
                oxygenSaturation
            },
            arrivalTime: new Date(),
            estimatedWaitTime: calculateEstimatedWaitTime(department, urgencyLevel)
        };
        
        // Add to queue (sorted by urgency level)
        addToQueue(newPatient);
        
        // Reset form
        addPatientForm.reset();
        
        // Show success message
        alert(`Patient ${name} added to queue with token ${token}`);
    }
    
    // Add patient to queue and sort by urgency
    function addToQueue(patient) {
        // Add to local array
        patientQueue.push(patient);
        
        // Sort queue by urgency level (descending) and then by arrival time (ascending)
        patientQueue.sort((a, b) => {
            if (b.urgencyLevel !== a.urgencyLevel) {
                return b.urgencyLevel - a.urgencyLevel;
            }
            return new Date(a.arrivalTime) - new Date(b.arrivalTime);
        });
        
        // Update the display
        updateQueueDisplay();
        
        // Send to server (in a real app)
        sendQueueToServer();
    }
    
    // Calculate estimated wait time based on department and urgency
    function calculateEstimatedWaitTime(department, urgencyLevel) {
        // Base wait times by department (in minutes)
        const departmentWaitTimes = {
            'General Medicine': 30,
            'Cardiology': 45,
            'Orthopedics': 40,
            'Pediatrics': 25,
            'Neurology': 50,
            'Emergency': 15
        };
        
        // Adjust by urgency level
        const urgencyMultipliers = {
            1: 1.5,    // Low priority - longer wait
            2: 1.0,    // Medium priority - standard wait
            3: 0.6,    // High priority - shorter wait
            4: 0.3     // Critical - very short wait
        };
        
        // Calculate base wait time
        let waitTime = departmentWaitTimes[department] || 30;
        
        // Apply urgency multiplier
        waitTime *= urgencyMultipliers[urgencyLevel] || 1.0;
        
        // Adjust based on queue length for that department
        const departmentQueueLength = patientQueue.filter(p => p.department === department).length;
        waitTime += departmentQueueLength * 5; // Add 5 minutes per person already in queue
        
        return Math.round(waitTime);
    }
    
    // Update the queue display
    function updateQueueDisplay() {
        // Clear the table
        queueTableBody.innerHTML = '';
        
        // Update counters
        totalPatientsElement.textContent = patientQueue.length;
        waitingPatientsElement.textContent = patientQueue.length;
        
        // Calculate average wait time
        const totalWaitTime = patientQueue.reduce((sum, patient) => sum + patient.estimatedWaitTime, 0);
        const avgWaitTime = patientQueue.length > 0 ? Math.round(totalWaitTime / patientQueue.length) : 0;
        avgWaitTimeElement.textContent = avgWaitTime;
        
        // Update department load
        updateDepartmentLoad();
        
        // Add each patient to the table
        patientQueue.forEach(patient => {
            const row = document.createElement('tr');
            
            // Set row color based on urgency
            if (patient.urgencyLevel === 4) {
                row.classList.add('table-danger');
            } else if (patient.urgencyLevel === 3) {
                row.classList.add('table-warning');
            }
            
            // Calculate wait time so far
            const waitedSoFar = Math.round((new Date() - new Date(patient.arrivalTime)) / 60000); // in minutes
            
            // Create urgency badge
            let urgencyBadge = '';
            switch(patient.urgencyLevel) {
                case 1:
                    urgencyBadge = '<span class="badge bg-success">Low</span>';
                    break;
                case 2:
                    urgencyBadge = '<span class="badge bg-info">Medium</span>';
                    break;
                case 3:
                    urgencyBadge = '<span class="badge bg-warning text-dark">High</span>';
                    break;
                case 4:
                    urgencyBadge = '<span class="badge bg-danger">Critical</span>';
                    break;
            }
            
            // Add row content
            row.innerHTML = `
                <td><strong>${patient.token}</strong></td>
                <td>${patient.name}</td>
                <td>${patient.age}/${patient.gender.charAt(0)}</td>
                <td>${patient.department}</td>
                <td>${urgencyBadge}</td>
                <td>${waitedSoFar} min / ${patient.estimatedWaitTime} min</td>
