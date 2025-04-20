// src/pages/BedManagement.jsx
import React, { useState, useEffect } from 'react';
import { fetchBeds, fetchBedStats, updateBedStatus } from '../api/bedApi';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function BedManagement() {
  const [beds, setBeds] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    maintenance: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [filterFloor, setFilterFloor] = useState('All');
  const [filterWard, setFilterWard] = useState('All');

  useEffect(() => {
    loadBeds();
  }, []);

  const loadBeds = async () => {
    try {
      setLoading(true);
      const [bedsData, statsData] = await Promise.all([
        fetchBeds(),
        fetchBedStats()
      ]);
      setBeds(bedsData);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading bed data:', error);
      setError('Failed to load bed data. Please try again.');
      setLoading(false);
    }
  };

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
  };

  const handleStatusChange = async (bedId, newStatus) => {
    try {
      await updateBedStatus(bedId, newStatus);
      await loadBeds();
      if (selectedBed && selectedBed._id === bedId) {
        setSelectedBed(null);
      }
    } catch (error) {
      console.error('Error updating bed status:', error);
      alert('Failed to update bed status. Please try again.');
    }
  };

  // Get unique floors and wards for filtering
  const floors = ['All', ...new Set(beds.map(bed => bed.location.floor))];
  const wards = ['All', ...new Set(beds.map(bed => bed.location.ward))];

  // Filter beds based on selected floor and ward
  const filteredBeds = beds.filter(bed => 
    (filterFloor === 'All' || bed.location.floor === filterFloor) &&
    (filterWard === 'All' || bed.location.ward === filterWard)
  );

  // Group beds by room for display
  const bedsByRoom = filteredBeds.reduce((acc, bed) => {
    const roomKey = `${bed.location.floor}-${bed.location.room}`;
    if (!acc[roomKey]) {
      acc[roomKey] = {
        floor: bed.location.floor,
        room: bed.location.room,
        beds: []
      };
    }
    acc[roomKey].beds.push(bed);
    return acc;
  }, {});

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-900/50 text-green-300 border-green-700';
      case 'Occupied': return 'bg-red-900/50 text-red-300 border-red-700';
      case 'Maintenance': return 'bg-yellow-900/50 text-yellow-300 border-yellow-700';
      case 'Reserved': return 'bg-blue-900/50 text-blue-300 border-blue-700';
      default: return 'bg-gray-900/50 text-gray-300 border-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Bed Management</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadBeds}
          >
            <i className="fas fa-sync-alt mr-2"></i> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-400">Total Beds</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-400">Available</p>
            <p className="text-2xl font-bold text-green-400">{stats.available}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-400">Occupied</p>
            <p className="text-2xl font-bold text-red-400">{stats.occupied}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-sm text-gray-400">Occupancy Rate</p>
            <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-gray-800/50 p-4 rounded-lg">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Floor</label>
          <select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
          >
            {floors.map(floor => (
              <option key={floor} value={floor}>{floor}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ward</label>
          <select
            value={filterWard}
            onChange={(e) => setFilterWard(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
          >
            {wards.map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bed Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bed Grid */}
        <div className="md:col-span-2 space-y-6">
          {Object.values(bedsByRoom).map(roomGroup => (
            <Card key={`${roomGroup.floor}-${roomGroup.room}`}>
              <h3 className="text-lg font-semibold mb-3">
                {roomGroup.floor} - {roomGroup.room}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {roomGroup.beds.map(bed => (
                  <div
                    key={bed._id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-blue-500 ${getStatusColor(bed.status)}`}
                    onClick={() => handleBedClick(bed)}
                  >
                    <div className="font-bold">{bed.bedId}</div>
                    <div className="text-xs mt-1">{bed.status}</div>
                    {bed.patientId && (
                      <div className="text-xs mt-1 truncate">
                        <i className="fas fa-user-injured mr-1"></i> Patient assigned
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
          
          {Object.keys(bedsByRoom).length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <i className="fas fa-bed text-5xl mb-4"></i>
              <p>No beds match the selected filters</p>
            </div>
          )}
        </div>

        {/* Bed Details */}
        <div>
          <Card>
            {selectedBed ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{selectedBed.bedId}</h3>
                  <Button
                    variant="text"
                    size="xs"
                    onClick={() => setSelectedBed(null)}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${getStatusColor(selectedBed.status)}`}>
                      {selectedBed.status}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <p className="text-xs text-gray-400">Floor</p>
                        <p>{selectedBed.location.floor}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Room</p>
                        <p>{selectedBed.location.room}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Ward</p>
                        <p>{selectedBed.location.ward}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedBed.patientId && (
                    <div>
                      <p className="text-sm text-gray-400">Patient</p>
                      <p className="mt-1">
                        {selectedBed.patientId}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-400">Last Cleaned</p>
                    <p className="mt-1">
                      {selectedBed.lastCleaned 
                        ? new Date(selectedBed.lastCleaned).toLocaleString() 
                        : 'Not recorded'}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <p className="text-sm text-gray-400 mb-2">Change Status</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={selectedBed.status === 'Available' ? 'primary' : 'outline'}
                        onClick={() => handleStatusChange(selectedBed._id, 'Available')}
                        disabled={selectedBed.status === 'Available'}
                      >
                        Available
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedBed.status === 'Maintenance' ? 'primary' : 'outline'}
                        onClick={() => handleStatusChange(selectedBed._id, 'Maintenance')}
                        disabled={selectedBed.status === 'Maintenance'}
                      >
                        Maintenance
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedBed.status === 'Reserved' ? 'primary' : 'outline'}
                        onClick={() => handleStatusChange(selectedBed._id, 'Reserved')}
                        disabled={selectedBed.status === 'Reserved'}
                      >
                        Reserved
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <i className="fas fa-bed text-5xl mb-4"></i>
                <p>Select a bed to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
