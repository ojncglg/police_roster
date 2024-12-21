import SickTimeBaseForm from './SickTimeBaseForm';
import type { SickTimeFormData } from '../../types/sickTime';

interface SickCallOutFormProps {
  onSubmit: (data: SickTimeFormData) => void;
  onCancel: () => void;
}

const SickCallOutForm = ({ onSubmit, onCancel }: SickCallOutFormProps) => {
  return (
    <SickTimeBaseForm
      allowMultipleDates={false}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default SickCallOutForm;
