import { useState } from 'react';
import type { Officer } from '../../types/officer';
import type { SickTimeFormData } from '../../types/sickTime';
import Select from '../common/Select';
import Button from '../common/Button';
import SelectableMiniCalendar from '../common/SelectableMiniCalendar';
import { useOfficers } from '../../hooks/useOfficers';

interface SickTimeBaseFormProps {
  allowMultipleDates?: boolean;
  onSubmit: (data: SickTimeFormData) => void;
  onCancel: () => void;
}

const SickTimeBaseForm = ({ 
  allowMultipleDates = false, 
  onSubmit, 
  onCancel 
}: SickTimeBaseFormProps) => {
  const { officers } = useOfficers();
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [notes, setNotes] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      officerId: selectedOfficerId,
      dates: selectedDates,
      notes: notes.trim() || undefined
    });
  };

  const handleDateSelect = (date: Date) => {
    if (allowMultipleDates) {
      setSelectedDates(prev => {
        const dateExists = prev.some(d => d.toISOString().split('T')[0] === date.toISOString().split('T')[0]);
        if (dateExists) {
          return prev.filter(d => d.toISOString().split('T')[0] !== date.toISOString().split('T')[0]);
        }
        return [...prev, date];
      });
    } else {
      setSelectedDates([date]);
    }
  };

  const handleOfficerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOfficerId(e.target.value);
  };

  const officerOptions = officers.map((officer: Officer) => ({
    value: officer.id,
    label: `${officer.lastName}, ${officer.firstName} (${officer.badgeNumber})`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Select Officer
        </label>
        <Select
          options={[
            { value: '', label: 'Select an officer' },
            ...officerOptions
          ]}
          value={selectedOfficerId}
          onChange={handleOfficerSelect}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {allowMultipleDates ? 'Select Dates' : 'Select Date'}
        </label>
        <div className="mt-1">
          <SelectableMiniCalendar
            selectedDates={selectedDates}
            onSelectDate={handleDateSelect}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-police-yellow focus:border-police-yellow dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!selectedOfficerId || selectedDates.length === 0}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default SickTimeBaseForm;
