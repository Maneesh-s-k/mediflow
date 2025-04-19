// src/components/patients/PatientList.jsx
import React, { useState, useEffect } from 'react';
import { fetchPatients } from '../../services/api';

const PatientList = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const data = await fetchPatients();
        setPatients(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load patients');
        setLoading(false);
        console.error(err);
      }
    };
    
    loadPatients();
  }, []);
  
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });
  
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-4">
        <div className="text-red-500 text-center py-8">
          <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-gray-700">
      <div className="bg-blue-800/50 backdrop-blur-sm px-4 py-3">
        <h3 className="font-semibold text-white">Patient List</h3>
      </div>
      
      <div className="p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 pl-10"
              />
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            </div>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-700 rounded-md border border-gray-600"
            >
              <option value="all">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="In Treatment">In Treatment</option>
              <option value="Admitted">Admitted</option>
              <option value="Discharged">Discharged</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Patient ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age/Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-gray-400">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr key={patient._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.patientId}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{patient.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age} / {patient.gender}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        patient.status === 'Waiting' ? 'bg-amber-900/50 text-amber-300 border border-amber-800' :
                        patient.status === 'In Treatment' ? 'bg-blue-900/50 text-blue-300 border border-blue-800' :
                        patient.status === 'Admitted' ? 'bg-purple-900/50 text-purple-300 border border-purple-800' :
                        'bg-green-900/50 text-green-300 border border-green-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => onSelectPatient(patient)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="text-blue-400 hover:text-blue-300">
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientList;
