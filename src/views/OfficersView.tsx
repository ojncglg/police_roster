import { useState, useEffect } from 'react';
import { withAuth } from '../hocs/withAuth';
import OfficerList from '../components/officers/OfficerList';
import OfficerForm from '../components/officers/OfficerForm';
import Card from '../components/common/Card';
import { CardHeader } from '../components/common/Card';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { officerService } from '../services/officerService';
import { notificationService } from '../services/notificationService';
import type { Officer } from '../types/officer';

const OfficersView = () => {
  const { user } = useAuth();
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);

  useEffect(() => {
    loadOfficers();
  }, []);

  const loadOfficers = async () => {
    try {
      const data = await officerService.getAllOfficers();
      setOfficers(data);
    } catch (error) {
      notificationService.error('Failed to load officers');
    }
  };

  const handleEdit = (officer: Officer) => {
    setSelectedOfficer(officer);
    setIsEditModalOpen(true);
  };

  const handleDelete = (officer: Officer) => {
    try {
      officerService.deleteOfficer(officer.id);
      setOfficers(prev => prev.filter(o => o.id !== officer.id));
      notificationService.success('Officer deleted successfully');
    } catch (error) {
      notificationService.error('Failed to delete officer');
    }
  };

  const handleAddOfficer = () => {
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = (updatedOfficer: Officer) => {
    if (selectedOfficer) {
      // Editing existing officer
      setOfficers(prev => prev.map(o => o.id === updatedOfficer.id ? updatedOfficer : o));
      setIsEditModalOpen(false);
      setSelectedOfficer(null);
    } else {
      // Adding new officer
      setOfficers(prev => [...prev, updatedOfficer]);
      setIsAddModalOpen(false);
    }
  };

  const handleFormCancel = () => {
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedOfficer(null);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-police-black to-gray-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.username}
        </h1>
        <p className="text-gray-300">
          Manage officer information and assignments in the NCCPD roster system.
        </p>
      </div>

      {/* Officer Management Section */}
      <Card>
        <CardHeader
          title="Officer Management"
          subtitle="Add, edit, and manage officer information"
          action={
            <div className="flex items-center space-x-4">
              <Button
                variant="primary"
                onClick={handleAddOfficer}
                icon={
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-labelledby="add-officer-icon">
                    <title id="add-officer-icon">Add New Officer</title>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                }
              >
                Add Officer
              </Button>
              <div className="text-sm text-gray-500">
                Last login: {new Date(user?.lastLogin || '').toLocaleString()}
              </div>
            </div>
          }
        />
        <div className="mt-4">
          <OfficerList 
            officers={officers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Active Officers</h3>
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-labelledby="active-officers-icon"
                role="img"
              >
                <title id="active-officers-icon">Active Officers Icon</title>
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <span className="text-3xl font-bold">{officers.filter(o => o.isActive).length}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">On Duty Today</h3>
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-labelledby="on-duty-icon"
                role="img"
              >
                <title id="on-duty-icon">On Duty Officers Icon</title>
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="text-3xl font-bold">
                {officers.filter(o => o.status === 'active').length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Special Assignments</h3>
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-labelledby="special-assignments-icon"
                role="img"
              >
                <title id="special-assignments-icon">Special Assignments Icon</title>
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
              <span className="text-3xl font-bold">
                {officers.filter(o => o.specialAssignments.length > 0).length}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleFormCancel}
        title={`Edit Officer: ${selectedOfficer?.firstName} ${selectedOfficer?.lastName}`}
      >
        {selectedOfficer && (
          <OfficerForm
            officer={selectedOfficer}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleFormCancel}
        title="Add New Officer"
      >
        <OfficerForm
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
};

export default withAuth(OfficersView);
