import { useState, useEffect } from 'react';
import type { Officer } from '../types/officer';
import { isCommandRank } from '../types/officer';
import { notificationService } from '../services/notificationService';
import { officerService } from '../services/officerService';
import Modal from '../components/common/Modal';
import OfficerForm from '../components/officers/OfficerForm';

const EditOfficersView = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);

  // Load officers from service on component mount
  useEffect(() => {
    const loadOfficers = async () => {
      try {
        const data = await officerService.getAllOfficers();
        setOfficers(data);
      } catch (error) {
        notificationService.error('Failed to load officers');
      }
    };
    loadOfficers();
  }, []);

  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (officer: Officer) => {
    setSelectedOfficer(officer);
    setIsModalOpen(true);
  };

  const handleUpdate = async (updatedOfficer: Officer) => {
    if (!selectedOfficer) return;
    
    try {
      // Convert Officer to OfficerFormData by ensuring required fields
      const formData = {
        ...updatedOfficer,
        specialAssignment: updatedOfficer.specialAssignment || '',
        email: updatedOfficer.email || '',
        phone: updatedOfficer.phone || '',
        notes: updatedOfficer.notes || ''
      };
      
      const result = await officerService.updateOfficer(selectedOfficer.id, formData);
      setOfficers(officers.map(o => o.id === result.id ? result : o));
      setIsModalOpen(false);
      setSelectedOfficer(null);
      notificationService.success('Officer updated successfully');
    } catch (error) {
      if (error instanceof Error) {
        notificationService.error(error.message);
      }
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedOfficer(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Officers</h1>
      </div>

      <div className="space-y-4">
        {officers.map((officer, index) => (
          <div key={`${officer.badgeNumber}-${index}`} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">
                  {officer.firstName} {officer.lastName}
                </span>
                <span className="text-gray-500 ml-2">({officer.badgeNumber})</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">- {officer.rank}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">{officer.zone}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {isCommandRank(officer.rank) ? 
                    (officer.isOnDesk ? 'On Desk' : 'On Patrol') : 
                    `Sector ${officer.sector}`}
                </span>
                {officer.specialAssignments.length > 0 && (
                  <span className="text-blue-600 dark:text-blue-400 ml-2">
                    - {officer.specialAssignments.join(', ')}
                  </span>
                )}
              </div>
              <button 
                onClick={() => handleEdit(officer)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={`Edit Officer: ${selectedOfficer?.firstName} ${selectedOfficer?.lastName}`}
      >
        {selectedOfficer && (
          <OfficerForm
            officer={selectedOfficer}
            onSubmit={handleUpdate}
            onCancel={handleCancel}
          />
        )}
      </Modal>
    </div>
  );
};

export default EditOfficersView;
