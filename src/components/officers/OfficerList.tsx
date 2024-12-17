import { useState, useEffect } from 'react';
import type { Officer } from '../../types/officer';
import type { SortableValue } from '../../hooks/useTable';
import { useTable } from '../../hooks/useTable';
import { useModal } from '../../hooks/useModal';
import { officerService } from '../../services/officerService';
import { notificationService } from '../../services/notificationService';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';
import Modal, { ConfirmationModal } from '../common/Modal';
import OfficerForm from './OfficerForm';
import LoadingSpinner from '../common/LoadingSpinner';

const OfficerList = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadOfficers = () => {
      try {
        const data = officerService.getAllOfficers();
        setOfficers(data);
      } catch (error) {
        notificationService.error('Failed to load officers');
      } finally {
        setIsLoading(false);
      }
    };
    loadOfficers();
  }, []);

  const {
    isOpen: isAddModalOpen,
    open: openAddModal,
    close: closeAddModal
  } = useModal();

  const {
    isOpen: isEditModalOpen,
    open: openEditModal,
    close: closeEditModal
  } = useModal();

  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal
  } = useModal();

  const {
    data: displayedOfficers,
    handleFilterChange,
    handleSort,
    filter
  } = useTable<Officer & { [key: string]: SortableValue }>({
    data: officers as (Officer & { [key: string]: SortableValue })[],
    initialSort: { field: 'lastName', direction: 'asc' },
    filterFn: (officer, filter) => {
      const searchTerm = filter.toLowerCase();
      return (
        officer.badgeNumber.toLowerCase().includes(searchTerm) ||
        officer.firstName.toLowerCase().includes(searchTerm) ||
        officer.lastName.toLowerCase().includes(searchTerm) ||
        officer.rank.toLowerCase().includes(searchTerm)
      );
    }
  });

  const handleAddOfficer = (officer: Officer) => {
    setOfficers(prev => [...prev, officer]);
    closeAddModal();
    notificationService.success('Officer added successfully');
  };

  const handleEditOfficer = (officer: Officer) => {
    setOfficers(prev => prev.map(o => o.id === officer.id ? officer : o));
    closeEditModal();
    notificationService.success('Officer updated successfully');
  };

  const handleDeleteOfficer = async () => {
    if (!selectedOfficer) return;

    try {
      await officerService.deleteOfficer(selectedOfficer.id);
      setOfficers(prev => prev.filter(o => o.id !== selectedOfficer.id));
      notificationService.success('Officer deleted successfully');
      closeDeleteModal();
    } catch (error) {
      if (error instanceof Error) {
        notificationService.error(error.message);
      }
    }
  };

  const getStatusColor = (status: Officer['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'training':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Input
            placeholder="Search officers..."
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="max-w-md"
            leftIcon={
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Search officers</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <Button
          onClick={openAddModal}
          className="bg-police-yellow hover:bg-yellow-600 text-black"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Add new officer</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Add Officer
        </Button>
      </div>

      {/* Officers List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  onClick={() => handleSort('badgeNumber')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Badge #
                </th>
                <th 
                  onClick={() => handleSort('lastName')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Name
                </th>
                <th 
                  onClick={() => handleSort('rank')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignment
                </th>
                <th 
                  onClick={() => handleSort('status')}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {officer.badgeNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {officer.lastName}, {officer.firstName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {officer.rank}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Zone {officer.zoneId.replace('z', '')}, Sector {officer.sectorId.replace('s', '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(officer.status)}`}>
                      {officer.status.charAt(0).toUpperCase() + officer.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => {
                        setSelectedOfficer(officer);
                        openEditModal();
                      }}
                      className="mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => {
                        setSelectedOfficer(officer);
                        openDeleteModal();
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Officer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title="Add New Officer"
      >
        <OfficerForm
          onSubmit={handleAddOfficer}
          onCancel={closeAddModal}
        />
      </Modal>

      {/* Edit Officer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title="Edit Officer"
      >
        {selectedOfficer && (
          <OfficerForm
            officer={selectedOfficer}
            onSubmit={handleEditOfficer}
            onCancel={closeEditModal}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteOfficer}
        title="Delete Officer"
        message={`Are you sure you want to delete ${selectedOfficer?.firstName} ${selectedOfficer?.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default OfficerList;
