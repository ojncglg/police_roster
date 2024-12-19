import { useState } from 'react';
import type { Officer } from '../types/officer';
import { notificationService } from '../services/notificationService';

const EditOfficersView = () => {
  const [officers] = useState<Officer[]>([
    {
      id: '1',
      firstName: 'S/LT.',
      lastName: 'ZEISSIG',
      badgeNumber: '#2413',
      rank: 'Squad Commander',
      zone: 'North',
      sector: 'Sector 1',
      status: 'active',
      specialAssignments: [],
      isActive: true
    },
    {
      id: '2',
      firstName: 'SGT.',
      lastName: 'WEGLARZ',
      badgeNumber: '#2577',
      rank: 'Float Sergeant',
      zone: 'Central',
      sector: 'Sector 3',
      specialAssignment: 'CNT',
      status: 'active',
      specialAssignments: ['CNT', 'CIT'],
      isActive: true
    },
    {
      id: '3',
      firstName: '',
      lastName: 'GEORTLER',
      badgeNumber: '#2784',
      rank: 'Data Officer',
      zone: 'South',
      sector: 'Sector 4',
      status: 'active',
      specialAssignments: [],
      isActive: true
    }
  ]);

  const handleEdit = (selectedOfficer: Officer) => {
    notificationService.info(`Edit functionality coming soon for ${selectedOfficer.firstName} ${selectedOfficer.lastName}`);
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
                <span className="text-gray-600 dark:text-gray-400 ml-2">Zone {officer.zone}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">{officer.sector}</span>
                {officer.specialAssignment && (
                  <span className="text-blue-600 dark:text-blue-400 ml-2">- {officer.specialAssignment}</span>
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
    </div>
  );
};

export default EditOfficersView;
