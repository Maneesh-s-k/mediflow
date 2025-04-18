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
                // Sort the queue by urgency level and arrival time
                sortQueueByPriority();
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
        sortQueueByPriority();
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
        
        // Sort queue by priority
        sortQueueByPriority();
        
        // Update the display
        updateQueueDisplay();
        
        // Send to server (in a real app)
        sendQueueToServer();
    }
    
    // Sort queue by urgency level and arrival time
    function sortQueueByPriority() {
        // Sort by urgency level (descending) and then by arrival time (ascending)
        patientQueue.sort((a, b) => {
            // First compare by urgency level (4 is highest, 1 is lowest)
            if (b.urgencyLevel !== a.urgencyLevel) {
                return b.urgencyLevel - a.urgencyLevel;
            }
            
            // If urgency levels are the same, sort by arrival time (oldest first)
            return new Date(a.arrivalTime) - new Date(b.arrivalTime);
        });
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
                <td>
                    <button class="btn btn-sm btn-primary call-patient" data-id="${patient.id}">
                        <i class="fas fa-phone-alt"></i>
                    </button>
                    <button class="btn btn-sm btn-danger remove-patient" data-id="${patient.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </td>
            `;
            
            // Add event listeners to buttons
            row.querySelector('.call-patient').addEventListener('click', () => callSpecificPatient(patient.id));
            row.querySelector('.remove-patient').addEventListener('click', () => removePatient(patient.id));
            
            // Add to table
            queueTableBody.appendChild(row);
        });
    }
    
    // Update department load display
    function updateDepartmentLoad() {
        const departments = ['General Medicine', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology', 'Emergency'];
        const departmentLoadElement = document.getElementById('departmentLoad');
        
        // Clear current list
        departmentLoadElement.innerHTML = '';
        
        // Count patients by department
        const departmentCounts = {};
        departments.forEach(dept => {
            departmentCounts[dept] = patientQueue.filter(p => p.department === dept).length;
        });
        
        // Create list items
        departments.forEach(dept => {
            const count = departmentCounts[dept] || 0;
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            // Add color coding based on load
            let badgeClass = 'bg-primary';
            if (count > 5) {
                badgeClass = 'bg-danger';
            } else if (count > 3) {
                badgeClass = 'bg-warning text-dark';
            }
            
            li.innerHTML = `
                ${dept}
                <span class="badge ${badgeClass} rounded-pill">${count}</span>
            `;
            
            departmentLoadElement.appendChild(li);
        });
    }
    
    // Call the next patient in queue
    function callNextPatient() {
        if (patientQueue.length === 0) {
            alert('No patients in queue');
            return;
        }
        
        // Get the highest priority patient (already sorted)
        currentPatient = patientQueue.shift();
        
        // Update the display
        displayCurrentPatient();
        updateQueueDisplay();
        
        // Send to server (in a real app)
        sendQueueToServer();
    }
    
    // Call a specific patient by ID
    function callSpecificPatient(patientId) {
        const index = patientQueue.findIndex(p => p.id === patientId);
        
        if (index === -1) {
            alert('Patient not found in queue');
            return;
        }
        
        // Remove from queue and set as current
        currentPatient = patientQueue.splice(index, 1)[0];
        
        // Update the display
        displayCurrentPatient();
        updateQueueDisplay();
        
        // Send to server (in a real app)
        sendQueueToServer();
    }
    
    // Display the current patient being served
    function displayCurrentPatient() {
        if (currentPatient) {
            // Update the current patient display
            document.getElementById('servingToken').textContent = `Token ${currentPatient.token}`;
            document.getElementById('servingName').textContent = currentPatient.name;
            document.getElementById('servingDetails').textContent = 
                `${currentPatient.age}/${currentPatient.gender.charAt(0)} - ${currentPatient.department}`;
                
            // Set urgency badge
            let urgencyText = 'Low';
            let urgencyClass = 'bg-success';
            
            switch(currentPatient.urgencyLevel) {
                case 2:
                    urgencyText = 'Medium';
                    urgencyClass = 'bg-info';
                    break;
                case 3:
                    urgencyText = 'High';
                    urgencyClass = 'bg-warning text-dark';
                    break;
                case 4:
                    urgencyText = 'Critical';
                    urgencyClass = 'bg-danger';
                    break;
            }
            
            const servingUrgency = document.getElementById('servingUrgency');
            servingUrgency.textContent = urgencyText;
            servingUrgency.className = `badge ${urgencyClass}`;
            
            // Show current patient section, hide "no patient" section
            noPatientServing.style.display = 'none';
            currentPatientServing.style.display = 'block';
        } else {
            // No current patient, show "no patient" section
            noPatientServing.style.display = 'block';
            currentPatientServing.style.display = 'none';
        }
    }
    
    // Complete service for current patient
    function completeService() {
        if (!currentPatient) {
            alert('No patient currently being served');
            return;
        }
        
        // In a real app, you would send completion data to the server
        
        // Clear current patient
        currentPatient = null;
        displayCurrentPatient();
        
        // Send to server (in a real app)
        sendQueueToServer();
    }
    
    // Cancel service for current patient
    function cancelService() {
        if (!currentPatient) {
            alert('No patient currently being served');
            return;
        }
        
        // Ask for confirmation
        if (!confirm(`Are you sure you want to return ${currentPatient.name} to the queue?`)) {
            return;
        }
        
        // Add back to queue
        addToQueue(currentPatient);
        
        // Clear current patient
        currentPatient = null;
        displayCurrentPatient();
        
        // Send to server (in a real app)
        sendQueueToServer();
    }
    
    // Remove a patient from the queue
    function removePatient(patientId) {
        const index = patientQueue.findIndex(p => p.id === patientId);
        
        if (index === -1) {
            alert('Patient not found in queue');
            return;
        }
        
        const patient = patientQueue[index];
        
        // Ask for confirmation
        if (!confirm(`Are you sure you want to remove ${patient.name} from the queue?`)) {
            return;
        }
        
        // Remove from queue
        patientQueue.splice(index, 1);
        
        // Update the display
        updateQueueDisplay();
        
        // Send to server (in a real app)
        sendQueueToServer();
    }
    
    // Send queue data to server (in a real app)
    function sendQueueToServer() {
        // This would send the updated queue to the server
        // For now, we'll just update the dashboard count
        updateDashboardCount();
    }
    
    // Update the dashboard count
    async function updateDashboardCount() {
        try {
            const response = await fetch(`${API_URL}/patient-queue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    count: patientQueue.length,
                    avgWaitTime: parseInt(avgWaitTimeElement.textContent)
                })
            });
            
            if (!response.ok) {
                console.error('Failed to update dashboard count');
            }
        } catch (error) {
            console.error('Error updating dashboard count:', error);
        }
    }
    
    // Process patients from vitals capture system
    async function processTriagedPatients() {
        try {
            const response = await fetch(`${API_URL}/patient-queue/triaged`);
            if (response.ok) {
                const triagedPatients = await response.json();
                
                // Add each triaged patient to the queue
                triagedPatients.forEach(patient => {
                    addToQueue(patient);
                });
                
                // Clear the triaged patients list on the server
                await fetch(`${API_URL}/patient-queue/triaged/clear`, { method: 'POST' });
            }
        } catch (error) {
            console.error('Error processing triaged patients:', error);
        }
    }
    
    // Update the queue display every minute to refresh wait times
    setInterval(updateQueueDisplay, 60000);
    
    // Check for new triaged patients every 30 seconds
    setInterval(processTriagedPatients, 30000);
});
