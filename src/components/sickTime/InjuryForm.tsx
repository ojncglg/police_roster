import SickTimeBaseForm from './SickTimeBaseForm';
import type { SickTimeFormData } from '../../types/sickTime';

interface InjuryFormProps {
  onSubmit: (data: SickTimeFormData) => void;
  onCancel: () => void;
}

const InjuryForm = ({ onSubmit, onCancel }: InjuryFormProps) => {
  return (
    <SickTimeBaseForm
      allowMultipleDates={true}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default InjuryForm;
