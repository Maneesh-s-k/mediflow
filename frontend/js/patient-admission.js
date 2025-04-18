document.addEventListener('DOMContentLoaded', function() {
    // API endpoint
    const API_URL = 'http://localhost:3000/api';
    
    // Store admission data
    let admissionsData = [];
    let selectedAdmission = null;
    let bedAvailability = {
        General: 0,
        ICU: 0,
        Pediatric: 0,
        Maternity: 0,
        Isolation: 0
    };
    
    // DOM elements
    const newAdmissionForm = document.getElementById('newAdmissionForm');
    const searchQueueBtn = document.getElementById('searchQueueBtn');
    const queueSearch = document.getElementById('queueSearch');
    const queuePatientsList = document.getElementById('queuePatientsList');
    const admissionsTableBody = document.getElementById('admissionsTableBody');
    const todayAdmissionsElement = document.getElementById('todayAdmissions');
    const noAdmissionSelected = document.getElementById('noAdmissionSelected');
    const admissionDetails = document.getElementById('admissionDetails');
    const printAdmissionBtn = document.getElementById('printAdmissionBtn');
    const editAdmissionBtn = document.getElementById('editAdmissionBtn');
    const dischargeBtn = document.getElementById('dischargeBtn');
    
    // Initialize the page
    initializePage();
    
    // Event listeners
    newAdmissionForm.addEventListener('submit', handleNewAdmission);
    searchQueueBtn.addEventListener('click', searchQueue);
    queueSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchQueue();
        }
    });
    printAdmissionBtn.addEventListener('click', printAdmissionDetails);
    editAdmissionBtn.addEventListener('click', editAdmission);
    dischargeBtn.addEventListener('click', dischargePatient);
    
    // Functions
    
    // Initialize the page
    async function initializePage() {
        try {
            // Fetch admissions data
            const admissionsResponse = await fetch(`${API_URL}/admissions`);
            if (admissionsResponse.ok) {
                admissionsData = await admissionsResponse.json();
            } else {
                // For demo purposes, initialize with sample data if API fails
                initializeWithSampleData();
            }
            
            // Fetch bed availability
            const bedsResponse = await fetch(`${API_URL}/beds/availability`);
            if (bedsResponse.ok) {
                bedAvailability = await bedsResponse.json();
            } else {
                // For demo purposes, initialize with sample data if API fails
                initializeWithSampleBedData();
            }
            
            // Update the UI
            updateAdmissionsTable();
            updateBedAvailability();
            
        } catch (error) {
            console.error('Error initializing page:', error);
            // For demo purposes, initialize with sample data if API fails
            initializeWithSampleData();
            initializeWithSampleBedData();
            updateAdmissionsTable();
            updateBedAvailability();
        }
    }
    
    // Initialize with sample admissions data for demonstration
    function initializeWithSampleData() {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        admissionsData = [
            {
                id: "ADM001",
                patient: {
                    name: "James Wilson",
                    age: 62,
                    gender: "Male",
                    contactNumber: "555-123-4567",
                    emergencyContact: "555-987-6543"
                },
                admissionType: "Emergency",
                department: "Cardiology",
                diagnosis: "Myocardial Infarction",
                attendingDoctor: "Dr. Sarah Chen",
                wardType: "ICU",
                bedId: "ICU203",
                insuranceInfo: "Medicare #12345678",
                notes: "Patient presented with severe chest pain and shortness of breath.",
                admissionDate: today,
                dischargeDate: null
            },
            {
                id: "ADM002",
                patient: {
                    name: "Emily Rodriguez",
                    age: 34,
                    gender: "Female",
                    contactNumber: "555-234-5678",
                    emergencyContact: "555-876-5432"
                },
                admissionType: "Planned",
                department: "Obstetrics",
                diagnosis: "Scheduled C-Section",
                attendingDoctor: "Dr. Michael Johnson",
                wardType: "Maternity",
                bedId: "MAT405",
                insuranceInfo: "Blue Cross #87654321",
                notes: "Patient scheduled for C-section due to previous delivery complications.",
                admissionDate: today,
                dischargeDate: null
            },
            {
                id: "ADM003",
                patient: {
                    name: "Robert Thompson",
                    age: 45,
                    gender: "Male",
                    contactNumber: "555-345-6789",
                    emergencyContact: "555-765-4321"
                },
                admissionType: "Emergency",
                department: "Orthopedics",
                diagnosis: "Fractured Femur",
                attendingDoctor: "Dr. Lisa Wong",
                wardType: "General",
                bedId: "G112",
                insuranceInfo: "Aetna #23456789",
                notes: "Patient admitted after motor vehicle accident with right femur fracture.",
                admissionDate: yesterday,
                dischargeDate: null
            }
        ];
    }
    
    // Initialize with sample bed availability data
    function initializeWithSampleBedData() {
        bedAvailability = {
            General: 15,
            ICU: 3,
            Pediatric: 8,
            Maternity: 6,
            Isolation: 4
        };
    }
    
    // Update admissions table
    function updateAdmissionsTable() {
        // Clear the table
        admissionsTableBody.innerHTML = '';
        
        // Sort admissions by date (newest first)
        admissionsData.sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate));
        
        // Count today's admissions
        const today = new Date().toDateString();
        const todayCount = admissionsData.filter(a => new Date(a.admissionDate).toDateString() === today).length;
        todayAdmissionsElement.textContent = todayCount;
        
        // Add each admission to the table
        admissionsData.forEach(admission => {
            const row = document.createElement('tr');
            
            // Format admission date
            const admissionDate = new Date(admission.admissionDate);
            const formattedDate = admissionDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Add row content
            row.innerHTML = `
                <td>${admission.id}</td>
                <td>${admission.patient.name}</td>
                <td>${admission.patient.age}/${admission.patient.gender.charAt(0)}</td>
                <td>${admission.department}</td>
                <td>${admission.diagnosis}</td>
                <td>${admission.bedId}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-sm btn-primary view-admission" data-id="${admission.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            // Add event listener to view button
            row.querySelector('.view-admission').addEventListener('click', () => viewAdmission(admission.id));
            
            // Add to table
            admissionsTableBody.appendChild(row);
        });
    }
    
    // Update bed availability display
    function updateBedAvailability() {
        document.getElementById('generalAvailable').textContent = bedAvailability.General;
        document.getElementById('icuAvailable').textContent = bedAvailability.ICU;
        document.getElementById('pediatricAvailable').textContent = bedAvailability.Pediatric;
        document.getElementById('maternityAvailable').textContent = bedAvailability.Maternity;
        document.getElementById('isolationAvailable').textContent = bedAvailability.Isolation;
        
        // Update colors based on availability
        updateBedAvailabilityColor('generalAvailable', bedAvailability.General);
        updateBedAvailabilityColor('icuAvailable', bedAvailability.ICU);
        updateBedAvailabilityColor('pediatricAvailable', bedAvailability.Pediatric);
        updateBedAvailabilityColor('maternityAvailable', bedAvailability.Maternity);
        updateBedAvailabilityColor('isolationAvailable', bedAvailability.Isolation);
    }
    
    // Update bed availability color based on count
    function updateBedAvailabilityColor(elementId, count) {
        const element = document.getElementById(elementId);
        
        if (count === 0) {
            element.className = 'badge bg-danger';
        } else if (count < 3) {
            element.className = 'badge bg-warning text-dark';
        } else {
            element.className = 'badge bg-success';
        }
    }
    
    // Handle new admission form submission
    function handleNewAdmission(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('patientName').value;
        const age = document.getElementById('patientAge').value;
        const gender = document.getElementById('patientGender').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const emergencyContact = document.getElementById('emergencyContact').value;
        const admissionType = document.getElementById('admissionType').value;
        const department = document.getElementById('department').value;
        const diagnosis = document.getElementById('diagnosis').value;
        const attendingDoctor = document.getElementById('attendingDoctor').value;
        const wardType = document.getElementById('wardType').value;
        const insuranceInfo = document.getElementById('insuranceInfo').value;
        const notes = document.getElementById('admissionNotes').value;
        
        // Check bed availability
        if (bedAvailability[wardType] <= 0) {
            alert(`No beds available in ${wardType} Ward. Please select a different ward or check bed management.`);
            return;
        }
        
        // Generate admission ID (in a real app, this would come from the server)
        const admissionId = `ADM${Math.floor(1000 + Math.random() * 9000)}`;
        
        // Generate bed ID (in a real app, this would come from the server)
        const bedId = generateBedId(wardType);
        
        // Create new admission object
        const newAdmission = {
            id: admissionId,
            patient: {
                name,
                age,
                gender,
                contactNumber,
                emergencyContact
            },
            admissionType,
            department,
            diagnosis,
            attendingDoctor,
            wardType,
            bedId,
            insuranceInfo,
            notes,
            admissionDate: new Date(),
            dischargeDate: null
        };
        
        // Add to admissions data
        admissionsData.push(newAdmission);
        
        // Update bed availability
        bedAvailability[wardType]--;
        
        // Update UI
        updateAdmissionsTable();
        updateBedAvailability();
        
        // Reset form
        newAdmissionForm.reset();
        
        // Show success message
        alert(`Patient ${name} admitted successfully with ID ${admissionId}`);
        
        // View the new admission
        viewAdmission(admissionId);
        
        // Send to server (in a real app)
        sendAdmissionToServer(newAdmission);
    }
    
    // Generate a bed ID based on ward type
    function generateBedId(wardType) {
        const prefixMap = {
            'General': 'G',
            'ICU': 'ICU',
            'Pediatric': 'PED',
            'Maternity': 'MAT',
            'Isolation': 'ISO'
        };
        
        const prefix = prefixMap[wardType] || 'BED';
        const number = Math.floor(100 + Math.random() * 900);
        
        return `${prefix}${number}`;
    }
    
    // Search for patients in the queue
    async function searchQueue() {
        const searchTerm = queueSearch.value.trim().toLowerCase();
        
        if (!searchTerm) {
            queuePatientsList.innerHTML = `
                <div class="text-center p-3 text-muted">
                    <i class="fas fa-search fa-2x mb-2"></i>
                    <p>Search for patients in the queue</p>
                </div>
            `;
            return;
        }
        
        try {
            // Fetch queue data
            const response = await fetch(`${API_URL}/patient-queue/all`);
            let queueData = [];
            
            if (response.ok) {
                queueData = await response.json();
            } else {
                // For demo purposes, use sample data if API fails
                queueData = getSampleQueueData();
            }
            
            // Filter based on search term
            const filteredPatients = queueData.filter(patient => 
                patient.name.toLowerCase().includes(searchTerm) || 
                patient.token.toLowerCase().includes(searchTerm)
            );
            
            // Display results
            if (filteredPatients.length === 0) {
                queuePatientsList.innerHTML = `
                    <div class="text-center p-3 text-muted">
                        <i class="fas fa-user-slash fa-2x mb-2"></i>
                        <p>No patients found matching "${searchTerm}"</p>
                    </div>
                `;
            } else {
                queuePatientsList.innerHTML = '';
                
                filteredPatients.forEach(patient => {
                    const listItem = document.createElement('a');
                    listItem.href = '#';
                    listItem.className = 'list-group-item list-group-item-action';
                    
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
                    
                    listItem.innerHTML = `
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1">${patient.name} ${urgencyBadge}</h6>
                            <small>${patient.token}</small>
                        </div>
                        <p class="mb-1">${patient.age}/${patient.gender.charAt(0)} - ${patient.department}</p>
                        <small>${patient.symptoms}</small>
                    `;
                    
                    // Add event listener
                    listItem.addEventListener('click', () => selectQueuePatient(patient));
                    
                    queuePatientsList.appendChild(listItem);
                });
            }
            
        } catch (error) {
            console.error('Error searching queue:', error);
            queuePatientsList.innerHTML = `
                <div class="text-center p-3 text-danger">
                    <i class="fas fa-exclamation-circle fa-2x mb-2"></i>
                    <p>Error searching queue. Please try again.</p>
                </div>
            `;
        }
    }
    
    // Get sample queue data for demonstration
    function getSampleQueueData() {
        const currentTime = new Date();
        
        return [
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
    }
    
    // Select a patient from the queue for admission
    function selectQueuePatient(patient) {
        // Populate the admission form with patient data
        document.getElementById('patientName').value = patient.name;
        document.getElementById('patientAge').value = patient.age;
        document.getElementById('patientGender').value = patient.gender;
        
        // Set default values for other fields
        document.getElementById('admissionType').value = patient.urgencyLevel >= 3 ? 'Emergency' : 'Planned';
        document.getElementById('department').value = patient.department;
        document.getElementById('diagnosis').value = patient.symptoms;
        
        // Switch to the new admission tab
        document.getElementById('new-tab').click();
        
        // Focus on the contact number field (first empty required field)
        document.getElementById('contactNumber').focus();
        
        // Show success message
        alert(`Patient ${patient.name} selected from queue. Please complete the admission form.`);
    }
    
    // View admission details
    function viewAdmission(admissionId) {
        // Find the admission
        const admission = admissionsData.find(a => a.id === admissionId);
        
        if (!admission) {
            alert('Admission not found');
            return;
        }
        
        // Store the selected admission
        selectedAdmission = admission;
        
        // Update the details
        document.getElementById('detailName').textContent = admission.patient.name;
        document.getElementById('detailAgeGender').textContent = `${admission.patient.age}/${admission.patient.gender.charAt(0)}`;
        document.getElementById('detailContact').textContent = admission.patient.contactNumber;
        document.getElementById('detailEmergency').textContent = admission.patient.emergencyContact || 'Not provided';
        
        document.getElementById('detailID').textContent = admission.id;
        document.getElementById('detailType').textContent = admission.admissionType;
        document.getElementById('detailDepartment').textContent = admission.department;
        document.getElementById('detailDoctor').textContent = admission.attendingDoctor;
        
        document.getElementById('detailDiagnosis').textContent = admission.diagnosis;
        document.getElementById('detailWard').textContent = `${admission.wardType} Ward`;
        document.getElementById('detailBed').textContent = admission.bedId;
        document.getElementById('detailInsurance').textContent = admission.insuranceInfo || 'Not provided';
        
        document.getElementById('detailNotes').textContent = admission.notes || 'No additional notes.';
        
        // Show the details section
        noAdmissionSelected.style.display = 'none';
        admissionDetails.style.display = 'block';
    }
    
    // Print admission details (simulated)
    function printAdmissionDetails() {
        if (!selectedAdmission) {
            alert('No admission selected');
            return;
        }
        
        alert(`Printing admission details for ${selectedAdmission.patient.name} (${selectedAdmission.id})`);
        // In a real app, this would trigger a print dialog or generate a PDF
    }
    
    // Edit admission (simulated)
    function editAdmission() {
        if (!selectedAdmission) {
            alert('No admission selected');
            return;
        }
        
        alert(`Editing admission for ${selectedAdmission.patient.name} (${selectedAdmission.id})`);
        // In a real app, this would open an edit form or modal
    }
    
    // Discharge patient
    function dischargePatient() {
        if (!selectedAdmission) {
            alert('No admission selected');
            return;
        }
        
        // Ask for confirmation
        if (!confirm(`Are you sure you want to discharge ${selectedAdmission.patient.name}?`)) {
            return;
        }
        
        // Update admission with discharge date
        selectedAdmission.dischargeDate = new Date();
        
        // Update bed availability
        bedAvailability[selectedAdmission.wardType]++;
        
        // Update UI
        updateAdmissionsTable();
        updateBedAvailability();
        
        // Hide details
        noAdmissionSelected.style.display = 'block';
        admissionDetails.style.display = 'none';
        
        // Clear selected admission
        selectedAdmission = null;
        
        // Show success message
        alert('Patient discharged successfully');
        
        // Send to server (in a real app)
        sendDischargeToServer(selectedAdmission);
    }
    
    // Send admission data to server (in a real app)
    function sendAdmissionToServer(admission) {
        // This would send the admission data to the server
        console.log('Sending admission to server:', admission);
    }
    
    // Send discharge data to server (in a real app)
    function sendDischargeToServer(admission) {
        // This would send the discharge data to the server
        console.log('Sending discharge to server:', admission);
    }
});
