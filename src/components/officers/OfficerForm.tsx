import { useEffect } from 'react';
import type { Officer } from '../../types/officer';
import { RANKS, ZONES, SECTORS, SPECIAL_ASSIGNMENTS, isCommandRank } from '../../types/officer';
import type { OfficerFormData } from '../../types/officer';
import { useForm } from '../../hooks/useForm';
import { officerService } from '../../services/officerService';
import { notificationService } from '../../services/notificationService';
import Button from '../common/Button';
import Input from '../common/Input';
import { Select } from '../common/Input';
import Card from '../common/Card';

interface OfficerFormProps {
  initialData?: OfficerFormData;
  onSubmit: (data: OfficerFormData) => void;
  onCancel: () => void;
}

interface ValidationError {
  field: string;
  message: string;
}

const defaultFormData: OfficerFormData = {
  firstName: '',
  lastName: '',
  badgeNumber: '',
  rank: '',
  zone: '',
  sector: '',
  isOnDesk: false,
  specialAssignment: '',
  email: '',
  phone: '',
  status: 'active',
  notes: '',
  specialAssignments: [],
  isActive: true
};

const OfficerForm = ({ initialData, onSubmit, onCancel }: OfficerFormProps) => {
  const initialValues = initialData || defaultFormData;

  const { values, errors, handleChange, handleSubmit, setValue } = useForm<OfficerFormData>({
    initialValues,
    validate: (data: Partial<OfficerFormData>) => {
      // Create a complete form data by merging with default values
      const completeData: OfficerFormData = {
        ...defaultFormData,
        ...data
      };
      const validationErrors = officerService.validateOfficerData(completeData);
      return validationErrors.map((message: string): ValidationError => ({
        field: message.toLowerCase().includes('badge') ? 'badgeNumber' :
               message.toLowerCase().includes('first name') ? 'firstName' :
               message.toLowerCase().includes('last name') ? 'lastName' :
               message.toLowerCase().includes('rank') ? 'rank' :
               message.toLowerCase().includes('zone') ? 'zone' :
               message.toLowerCase().includes('sector') ? 'sector' :
               message.toLowerCase().includes('email') ? 'email' :
               message.toLowerCase().includes('phone') ? 'phone' : 'form',
        message
      }));
    },
    onSubmit: (data) => {
      onSubmit(data);
    }
  });

  // Filter sectors based on selected zone
  const availableSectors = SECTORS.filter(
    sector => sector.zoneId === values.zone
  );

  // Reset sector when zone changes
  useEffect(() => {
    if (!values.zone || !values.sector) return;
    
    const sectorExists = availableSectors.find(s => s.id === values.sector);
    if (!sectorExists) {
      setValue('sector', '');
    }
  }, [values.zone, values.sector, availableSectors, setValue]);

  // Handle sector and desk fields when rank changes
  useEffect(() => {
    if (isCommandRank(values.rank)) {
      // Clear sector for command ranks
      setValue('sector', '');
    } else {
      // Clear isOnDesk for non-command ranks
      setValue('isOnDesk', false);
    }
  }, [values.rank, setValue]);

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Badge Number */}
          <Input
            label="Badge Number"
            name="badgeNumber"
            value={values.badgeNumber}
            onChange={handleChange}
            error={errors.badgeNumber}
            required
          />

          {/* Rank */}
          <Select
            label="Rank"
            name="rank"
            value={values.rank}
            onChange={handleChange}
            error={errors.rank}
            options={RANKS.map(rank => ({ value: rank, label: rank }))}
            required
          />

          {/* First Name */}
          <Input
            label="First Name"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            error={errors.firstName}
            required
          />

          {/* Last Name */}
          <Input
            label="Last Name"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            error={errors.lastName}
            required
          />

          {/* Email */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Phone */}
          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          {/* Zone and Sector */}
          <Select
            label="Zone"
            name="zone"
            value={values.zone}
            onChange={handleChange}
            error={errors.zone}
            options={ZONES.map(zone => ({ value: zone.id, label: zone.name }))}
            required
          />
          <Select
            label="Sector"
            name="sector"
            value={values.sector}
            onChange={handleChange}
            error={errors.sector}
            options={availableSectors.map(sector => ({ 
              value: sector.id, 
              label: sector.name 
            }))}
            disabled={!values.zone}
            required
          />

          {/* Desk Duty Checkbox for Sergeants and above */}
          {isCommandRank(values.rank) && (
            <div className="md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={values.isOnDesk}
                  onChange={(e) => setValue('isOnDesk', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Assigned to Desk Duty</span>
              </label>
            </div>
          )}

          {/* Special Assignments */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Assignments
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {SPECIAL_ASSIGNMENTS.map(assignment => (
                <label key={assignment.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={values.specialAssignments.includes(assignment.id)}
                    onChange={(e) => {
                      const newAssignments = e.target.checked
                        ? [...values.specialAssignments, assignment.id]
                        : values.specialAssignments.filter(id => id !== assignment.id);
                      setValue('specialAssignments', newAssignments);
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{assignment.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <Select
            label="Status"
            name="status"
            value={values.status}
            onChange={handleChange}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'deployed', label: 'Deployed' },
              { value: 'fmla', label: 'FMLA' },
              { value: 'tdy', label: 'TDY' },
              { value: 'retired', label: 'Retired' },
              { value: 'adminLeave', label: 'Admin Leave' },
            ]}
            required
          />

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows={3}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
          >
            {officer ? 'Update Officer' : 'Add Officer'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OfficerForm;
