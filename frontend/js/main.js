document.addEventListener('DOMContentLoaded', function() {
    // API endpoint
    const API_URL = 'http://localhost:3000/api';
    
    // Function to fetch dashboard data from the server
    async function fetchDashboardData() {
        try {
            const response = await fetch(`${API_URL}/dashboard`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            updateDashboard(data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            alert('Failed to load dashboard data. Using dummy data instead.');
            // Use dummy data as fallback
            updateDashboard({
                patientQueue: { count: 0, avgWaitTime: 0 },
                bedStatus: { available: 0, occupancyRate: 0 },
                inventory: { lowStock: 0, critical: 0 }
            });
        }
    }
    
    // Function to update the dashboard with data
    function updateDashboard(data) {
        // Update patient queue section
        document.getElementById('queueCount').textContent = data.patientQueue.count;
        document.getElementById('avgWaitTime').textContent = data.patientQueue.avgWaitTime;
        
        // Update bed status section
        document.getElementById('availableBeds').textContent = data.bedStatus.available;
        document.getElementById('occupancyRate').textContent = data.bedStatus.occupancyRate;
        
        // Update inventory section
        document.getElementById('lowStockCount').textContent = data.inventory.lowStock;
        document.getElementById('criticalItems').textContent = data.inventory.critical;
    }
    
    // Fetch initial data
    fetchDashboardData();
    
    // Add event listeners for refresh buttons
    document.getElementById('refreshQueue').addEventListener('click', async function() {
        try {
            // Generate random data for demonstration
            const newCount = Math.floor(Math.random() * 30);
            const newWaitTime = Math.floor(Math.random() * 60);
            
            // Send update to server
            const response = await fetch(`${API_URL}/patient-queue`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    count: newCount,
                    avgWaitTime: newWaitTime
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update patient queue');
            }
            
            // Refresh all dashboard data
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating patient queue:', error);
            alert('Failed to update patient queue data');
        }
    });
    
    document.getElementById('refreshBeds').addEventListener('click', async function() {
        try {
            // Generate random data for demonstration
            const newAvailable = Math.floor(Math.random() * 100);
            const newOccupancy = Math.floor(Math.random() * 100);
            
            // Send update to server
            const response = await fetch(`${API_URL}/bed-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    available: newAvailable,
                    occupancyRate: newOccupancy
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update bed status');
            }
            
            // Refresh all dashboard data
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating bed status:', error);
            alert('Failed to update bed status data');
        }
    });
    
    document.getElementById('refreshInventory').addEventListener('click', async function() {
        try {
            // Generate random data for demonstration
            const newLowStock = Math.floor(Math.random() * 20);
            const newCritical = Math.floor(Math.random() * 10);
            
            // Send update to server
            const response = await fetch(`${API_URL}/inventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    lowStock: newLowStock,
                    critical: newCritical
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to update inventory');
            }
            
            // Refresh all dashboard data
            fetchDashboardData();
        } catch (error) {
            console.error('Error updating inventory:', error);
            alert('Failed to update inventory data');
        }
    });
});
