import { useEffect } from 'react';
import { Officer, OfficerFormData, RANKS, ZONES, SECTORS, SPECIAL_ASSIGNMENTS } from '../../types/officer';
import { useForm } from '../../hooks/useForm';
import { officerService } from '../../services/officerService';
import { notificationService } from '../../services/notificationService';
import Button from '../common/Button';
import Input from '../common/Input';
import { Select } from '../common/Input';
import Card from '../common/Card';

interface OfficerFormProps {
  officer?: Officer;
  onSubmit: (officer: Officer) => void;
  onCancel: () => void;
}

const OfficerForm = ({ officer, onSubmit, onCancel }: OfficerFormProps) => {
  const initialValues: OfficerFormData = {
    badgeNumber: '',
    firstName: '',
    lastName: '',
    rank: '',
    email: '',
    phone: '',
    zoneId: '',
    sectorId: '',
    specialAssignments: [],
    status: 'active',
    notes: '',
    ...officer,
  };

  const { values, errors, handleChange, handleSubmit, setValue } = useForm<OfficerFormData>({
    initialValues,
    validate: (data) => {
      const validationErrors = officerService.validateOfficerData(data);
      return validationErrors.map(message => ({
        field: message.toLowerCase().includes('badge') ? 'badgeNumber' :
               message.toLowerCase().includes('first name') ? 'firstName' :
               message.toLowerCase().includes('last name') ? 'lastName' :
               message.toLowerCase().includes('rank') ? 'rank' :
               message.toLowerCase().includes('zone') ? 'zoneId' :
               message.toLowerCase().includes('sector') ? 'sectorId' :
               message.toLowerCase().includes('email') ? 'email' :
               message.toLowerCase().includes('phone') ? 'phone' : 'form',
        message
      }));
    },
    onSubmit: async (data) => {
      try {
        const result = officer 
          ? await officerService.updateOfficer(officer.id, data)
          : await officerService.createOfficer(data);
        
        notificationService.success(
          officer 
            ? 'Officer updated successfully' 
            : 'Officer created successfully'
        );
        onSubmit(result);
      } catch (error) {
        if (error instanceof Error) {
          notificationService.error(error.message);
        }
      }
    }
  });

  // Filter sectors based on selected zone
  const availableSectors = SECTORS.filter(
    sector => sector.zoneId === values.zoneId
  );

  // Reset sector when zone changes
  useEffect(() => {
    if (!availableSectors.find(s => s.id === values.sectorId)) {
      setValue('sectorId', '');
    }
  }, [values.zoneId]);

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

          {/* Zone */}
          <Select
            label="Zone"
            name="zoneId"
            value={values.zoneId}
            onChange={handleChange}
            error={errors.zoneId}
            options={ZONES.map(zone => ({ value: zone.id, label: zone.name }))}
            required
          />

          {/* Sector */}
          <Select
            label="Sector"
            name="sectorId"
            value={values.sectorId}
            onChange={handleChange}
            error={errors.sectorId}
            options={availableSectors.map(sector => ({ 
              value: sector.id, 
              label: sector.name 
            }))}
            disabled={!values.zoneId}
            required
          />

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
                    className="rounded border-gray-300 text-police-yellow focus:ring-police-yellow"
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
              { value: 'inactive', label: 'Inactive' },
              { value: 'leave', label: 'On Leave' },
              { value: 'training', label: 'Training' },
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
              className="shadow-sm focus:ring-police-yellow focus:border-police-yellow block w-full sm:text-sm border-gray-300 rounded-md"
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
            className="bg-police-yellow hover:bg-yellow-600 text-black"
          >
            {officer ? 'Update Officer' : 'Add Officer'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default OfficerForm;
