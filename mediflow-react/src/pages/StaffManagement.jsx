import React, { useState } from 'react';
import Card from '../components/common/Card';
import StaffTable from '../components/staff/staff_table';
import StaffModal from '../components/staff/staff_modal';
import StaffDetails from '../components/staff/staff_details';
import { staffData as initialData } from '../data/staffData';
import Button from '../components/common/Button';

const StaffManagement = () => {
  const [staff, setStaff] = useState(initialData);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const handleView = (member) => {
    setSelectedStaff(member);
    setEditingStaff(null);
  };

  const handleEdit = (member) => {
    setEditingStaff(member);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingStaff(null);
    setModalOpen(true);
  };

  const handleSave = (member) => {
    setStaff(prev => {
      const exists = prev.find(s => s.id === member.id);
      if (exists) {
        // Edit
        return prev.map(s => s.id === member.id ? member : s);
      } else {
        // Add
        return [...prev, member];
      }
    });
    
    // If we're editing the currently selected staff, update that too
    if (selectedStaff && selectedStaff.id === member.id) {
      setSelectedStaff(member);
    }
  };

  const handleCloseDetails = () => {
    setSelectedStaff(null);
  };

  // Apply filters
  const filteredStaff = staff.filter(member => {
    if (filterRole && member.role !== filterRole) return false;
    if (filterDepartment && member.department !== filterDepartment) return false;
    return true;
  });

  // Get unique values for filters
  const roles = [...new Set(staff.map(m => m.role))];
  const departments = [...new Set(staff.map(m => m.department))];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card
          title="Staff Management"
          icon="fas fa-user-md"
          gradient="from-blue-900 to-blue-800"
          actions={
            <Button variant="primary" onClick={handleAdd} icon="fas fa-plus">
              Add Staff
            </Button>
          }
        >
          <div className="mb-4 flex flex-wrap gap-2">
            <select 
              value={filterRole} 
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            >
              <option value="">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            
            <select 
              value={filterDepartment} 
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            {(filterRole || filterDepartment) && (
              <button 
                onClick={() => {
                  setFilterRole('');
                  setFilterDepartment('');
                }}
                className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm hover:bg-gray-700"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          <StaffTable 
            staff={filteredStaff} 
            onView={handleView} 
            onEdit={handleEdit} 
          />
        </Card>
      </div>
      
      <div>
        <Card
          title="Staff Details"
          icon="fas fa-id-card"
          gradient="from-indigo-900 to-indigo-800"
        >
          <StaffDetails 
            staff={selectedStaff} 
            onClose={handleCloseDetails} 
            onEdit={handleEdit} 
          />
        </Card>
      </div>
      
      <StaffModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        staff={editingStaff}
      />
    </div>
  );
};

export default StaffManagement;
