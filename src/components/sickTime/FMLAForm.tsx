import SickTimeBaseForm from './SickTimeBaseForm';
import type { SickTimeFormData } from '../../types/sickTime';

interface FMLAFormProps {
  onSubmit: (data: SickTimeFormData) => void;
  onCancel: () => void;
}

const FMLAForm = ({ onSubmit, onCancel }: FMLAFormProps) => {
  return (
    <SickTimeBaseForm
      allowMultipleDates={true}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default FMLAForm;
