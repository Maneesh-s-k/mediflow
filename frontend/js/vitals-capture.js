document.addEventListener('DOMContentLoaded', function() {
    // API endpoint
    const API_URL = 'http://localhost:3000/api';
    
    // Store patient data
    let patientData = {
        personalInfo: {},
        vitals: {}
    };
    
    // Token counter (in a real app, this would come from the server)
    let tokenCounter = 1005;
    
    // DOM elements
    const patientInfoForm = document.getElementById('patientInfoForm');
    const vitalsForm = document.getElementById('vitalsForm');
    const patientInfoSection = document.getElementById('patientInfoSection');
    const vitalsSection = document.getElementById('vitalsSection');
    const triageResultSection = document.getElementById('triageResultSection');
    const patientNameDisplay = document.getElementById('patientNameDisplay');
    const newPatientBtn = document.getElementById('newPatientBtn');
    const printTokenBtn = document.getElementById('printTokenBtn');
    const sendSMSBtn = document.getElementById('sendSMSBtn');
    
    // Event listeners
    patientInfoForm.addEventListener('submit', handlePatientInfo);
    vitalsForm.addEventListener('submit', handleVitalsSubmission);
    newPatientBtn.addEventListener('click', resetForms);
    printTokenBtn.addEventListener('click', printToken);
    sendSMSBtn.addEventListener('click', sendSMS);
    
    // Functions
    
    // Handle patient information form submission
    function handlePatientInfo(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('patientName').value;
        const age = document.getElementById('patientAge').value;
        const gender = document.getElementById('patientGender').value;
        const chiefComplaint = document.getElementById('chiefComplaint').value;
        const department = document.getElementById('department').value;
        
        // Store in patient data
        patientData.personalInfo = {
            name,
            age,
            gender,
            chiefComplaint,
            department
        };
        
        // Update display
        patientNameDisplay.textContent = name;
        
        // Show vitals section
        patientInfoSection.style.display = 'none';
        vitalsSection.style.display = 'block';
        triageResultSection.style.display = 'none';
    }
    
    // Handle vitals form submission
    function handleVitalsSubmission(event) {
        event.preventDefault();
        
        // Get form values
        const bloodPressureSystolic = document.getElementById('bloodPressureSystolic').value;
        const bloodPressureDiastolic = document.getElementById('bloodPressureDiastolic').value;
        const heartRate = document.getElementById('heartRate').value;
        const temperature = document.getElementById('temperature').value;
        const oxygenSaturation = document.getElementById('oxygenSaturation').value;
        const respiratoryRate = document.getElementById('respiratoryRate').value;
        const weight = document.getElementById('weight').value;
        const height = document.getElementById('height').value;
        
        // Store in patient data
        patientData.vitals = {
            bloodPressure: `${bloodPressureSystolic}/${bloodPressureDiastolic}`,
            heartRate,
            temperature,
            oxygenSaturation,
            respiratoryRate,
            weight,
            height
        };
        
        // Calculate BMI if weight and height are provided
        if (weight && height) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            patientData.vitals.bmi = bmi.toFixed(1);
        }
        
        // Perform AI triage
        const triageResult = performAITriage(patientData);
        
        // Add triage result to patient data
        patientData.triage = triageResult;
        
        // Generate token
        patientData.token = `A${tokenCounter++}`;
        
        // Calculate estimated wait time based on urgency and department
        patientData.estimatedWaitTime = calculateWaitTime(triageResult.urgencyLevel, patientData.personalInfo.department);
        
        // Display triage results
        displayTriageResults();
        
        // Show triage result section
        patientInfoSection.style.display = 'none';
        vitalsSection.style.display = 'none';
        triageResultSection.style.display = 'block';
        
        // Send patient data to server
        sendPatientDataToServer();
    }
    
    // Perform AI triage based on vitals and patient info
    function performAITriage(patient) {
        // In a real application, this would be a sophisticated ML model
        // For this demo, we'll use a rule-based approach
        
        const vitals = patient.vitals;
        const info = patient.personalInfo;
        
        // Parse values
        const systolic = parseInt(vitals.bloodPressure.split('/')[0]);
        const diastolic = parseInt(vitals.bloodPressure.split('/')[1]);
        const hr = parseInt(vitals.heartRate);
        const temp = parseFloat(vitals.temperature);
        const o2 = parseInt(vitals.oxygenSaturation);
        const rr = parseInt(vitals.respiratoryRate);
        
        // Initialize score (higher = more urgent)
        let urgencyScore = 0;
        
        // Check blood pressure
        if (systolic >= 180 || diastolic >= 120) {
            urgencyScore += 3; // Hypertensive crisis
        } else if (systolic >= 140 || diastolic >= 90) {
            urgencyScore += 1; // Hypertension
        } else if (systolic < 90 || diastolic < 60) {
            urgencyScore += 2; // Hypotension
        }
        
        // Check heart rate
        if (hr > 120) {
            urgencyScore += 2; // Tachycardia
        } else if (hr < 50) {
            urgencyScore += 2; // Bradycardia
        }
        
        // Check temperature
        if (temp >= 103) {
            urgencyScore += 3; // High fever
        } else if (temp >= 100.4) {
            urgencyScore += 1; // Fever
        } else if (temp < 95) {
            urgencyScore += 3; // Hypothermia
        }
        
        // Check oxygen saturation
        if (o2 < 90) {
            urgencyScore += 4; // Severe hypoxemia
        } else if (o2 < 94) {
            urgencyScore += 2; // Moderate hypoxemia
        }
        
        // Check respiratory rate
        if (rr > 30) {
            urgencyScore += 3; // Severe tachypnea
        } else if (rr > 20) {
            urgencyScore += 1; // Mild tachypnea
        } else if (rr < 8) {
            urgencyScore += 3; // Bradypnea
        }
        
        // Check chief complaint for keywords indicating urgency
        const urgentKeywords = [
            'chest pain', 'difficulty breathing', 'shortness of breath', 
            'severe pain', 'bleeding', 'stroke', 'unconscious', 'seizure',
            'heart attack', 'trauma', 'head injury', 'broken', 'fracture'
        ];
        
        const complaint = info.chiefComplaint.toLowerCase();
        for (const keyword of urgentKeywords) {
            if (complaint.includes(keyword)) {
                urgencyScore += 2;
                break;
            }
        }
        
        // Check age (elderly and very young get higher priority)
        if (info.age < 5 || info.age > 75) {
            urgencyScore += 1;
        }
        
        // Determine urgency level based on score
        let urgencyLevel, urgencyText, urgencyClass, message;
        
        if (urgencyScore >= 8) {
            urgencyLevel = 4;
            urgencyText = 'Critical';
            urgencyClass = 'bg-danger';
            message = 'This patient requires immediate medical attention.';
        } else if (urgencyScore >= 5) {
            urgencyLevel = 3;
            urgencyText = 'High Priority';
            urgencyClass = 'bg-warning text-dark';
            message = 'This patient requires urgent care.';
        } else if (urgencyScore >= 2) {
            urgencyLevel = 2;
            urgencyText = 'Medium Priority';
            urgencyClass = 'bg-info text-dark';
            message = 'This patient requires standard priority care.';
        } else {
            urgencyLevel = 1;
            urgencyText = 'Low Priority';
            urgencyClass = 'bg-success';
            message = 'This patient can be seen in regular order.';
        }
        
        return {
            urgencyLevel,
            urgencyText,
            urgencyClass,
            message,
            score: urgencyScore
        };
    }
    
    // Calculate estimated wait time based on urgency and department
    function calculateWaitTime(urgencyLevel, department) {
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
        
        // Add some randomness (±5 minutes)
        waitTime += Math.floor(Math.random() * 10) - 5;
        
        // Ensure wait time is positive
        return Math.max(5, Math.round(waitTime));
    }
    
    // Display triage results
    function displayTriageResults() {
        // Update patient info
        document.getElementById('resultName').textContent = patientData.personalInfo.name;
        document.getElementById('resultAgeGender').textContent = 
            `${patientData.personalInfo.age}/${patientData.personalInfo.gender.charAt(0)}`;
        document.getElementById('resultDepartment').textContent = patientData.personalInfo.department;
        document.getElementById('resultComplaint').textContent = patientData.personalInfo.chiefComplaint;
        
        // Update vitals
        document.getElementById('resultBP').textContent = `${patientData.vitals.bloodPressure} mmHg`;
        document.getElementById('resultHR').textContent = `${patientData.vitals.heartRate} bpm`;
        document.getElementById('resultTemp').textContent = `${patientData.vitals.temperature} °F`;
        document.getElementById('resultO2').textContent = `${patientData.vitals.oxygenSaturation}%`;
        document.getElementById('resultRR').textContent = `${patientData.vitals.respiratoryRate} breaths/min`;
        
        // Update BMI if available
        if (patientData.vitals.bmi) {
            document.getElementById('resultBMI').textContent = patientData.vitals.bmi;
        } else {
            document.getElementById('resultBMI').textContent = 'N/A';
        }
        
        // Update triage assessment
        const urgencyDisplay = document.getElementById('urgencyLevelDisplay');
        urgencyDisplay.innerHTML = `<span class="badge ${patientData.triage.urgencyClass} fs-5 p-2">${patientData.triage.urgencyText}</span>`;
        document.getElementById('triageMessage').textContent = patientData.triage.message;
        
        // Update queue information
        document.getElementById('tokenNumber').textContent = `Token: ${patientData.token}`;
        document.getElementById('estimatedWaitTime').textContent = `${patientData.estimatedWaitTime} minutes`;
        document.getElementById('waitingArea').textContent = patientData.personalInfo.department;
    }
    
    // Send patient data to server
    async function sendPatientDataToServer() {
        try {
            // Create patient object for queue
            const patient = {
                id: Date.now(), // Use timestamp as ID
                token: patientData.token,
                name: patientData.personalInfo.name,
                age: patientData.personalInfo.age,
                gender: patientData.personalInfo.gender,
                department: patientData.personalInfo.department,
                urgencyLevel: patientData.triage.urgencyLevel,
                symptoms: patientData.personalInfo.chiefComplaint,
                vitals: {
                    bloodPressure: patientData.vitals.bloodPressure,
                    temperature: patientData.vitals.temperature,
                    heartRate: patientData.vitals.heartRate,
                    oxygenSaturation: patientData.vitals.oxygenSaturation,
                    respiratoryRate: patientData.vitals.respiratoryRate
                },
                arrivalTime: new Date(),
                estimatedWaitTime: patientData.estimatedWaitTime
            };
            
            // Send to server
            const response = await fetch(`${API_URL}/patient-queue/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(patient)
            });
            
            if (!response.ok) {
                throw new Error('Failed to add patient to queue');
            }
            
            console.log('Patient added to queue successfully');
        } catch (error) {
            console.error('Error adding patient to queue:', error);
            // In a real app, you would handle this error and possibly retry
        }
    }
    
    // Print token (simulated)
    function printToken() {
        alert(`Printing token ${patientData.token} for ${patientData.personalInfo.name}`);
        // In a real app, this would trigger a print dialog or send to a printer
    }
    
    // Send SMS (simulated)
    function sendSMS() {
        alert(`SMS sent to patient with token ${patientData.token} and wait time information`);
        // In a real app, this would integrate with an SMS gateway
    }
    
    // Reset forms for new patient
    function resetForms() {
        // Clear forms
        patientInfoForm.reset();
        vitalsForm.reset();
        
        // Show patient info section
        patientInfoSection.style.display = 'block';
        vitalsSection.style.display = 'none';
        triageResultSection.style.display = 'none';
        
        // Focus on first field
        document.getElementById('patientName').focus();
    }
});
