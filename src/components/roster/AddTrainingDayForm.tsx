/**
 * @file AddTrainingDayForm.tsx
 * @description Form component for adding training days to rosters.
 * Allows users to schedule training days that will be applied across all rosters.
 */

import { useState } from 'react';
import { rosterService } from '../../services/rosterService';
import { notificationService } from '../../services/notificationService';

/**
 * Props for AddTrainingDayForm component
 */
interface AddTrainingDayFormProps {
  onClose: () => void;  // Callback to close the form modal
}

/**
 * AddTrainingDayForm Component
 * 
 * @component
 * @description Provides a form interface for adding training days to all rosters.
 * Features:
 * - Date selection
 * - Optional description
 * - Validation
 * - Error handling
 * - Success notifications
 * 
 * @example
 * <AddTrainingDayForm onClose={() => setShowModal(false)} />
 */
const AddTrainingDayForm = ({ onClose }: AddTrainingDayFormProps) => {
  // Form state
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  /**
   * Handles form submission
   * Adds the training day to all existing rosters
   * 
   * @param e - Form submission event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required date field
    if (!date) {
      alert('Please select a date');
      return;
    }

    try {
      // Get all rosters and add the training day to each one
      const rosters = rosterService.getAllRosters();
      rosters.forEach(roster => {
        rosterService.addTrainingDay(roster.id, {
          date,
          // Only include description if it's not empty
          description: description.trim() || undefined
        });
      });

      // Show success notification and close form
      notificationService.success('Training day added successfully');
      onClose();
    } catch (error) {
      // Show error notification if operation fails
      notificationService.error('Failed to add training day');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date Input Field */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
          Training Date *
        </label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description Input Field */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Enter training details..."
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        {/* Cancel Button */}
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded"
        >
          Add Training Day
        </button>
      </div>
    </form>
  );
};

export default AddTrainingDayForm;
