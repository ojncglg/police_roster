import { useState, useCallback, ChangeEvent } from 'react';
import { ValidationError, ValidationService } from '../services/validationService';
import { notificationService } from '../services/notificationService';

type ValidationFunction<T> = (values: Partial<T>) => ValidationError[];

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: ValidationFunction<T>;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate single field on blur
    if (validate) {
      const validationErrors = validate(values);
      const fieldError = validationErrors.find(error => error.field === name);
      
      setErrors(prev => ({
        ...prev,
        [name]: fieldError ? fieldError.message : ''
      }));
    }
  }, [values, validate]);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Validate all fields
    if (validate) {
      const validationErrors = validate(values);
      if (validationErrors.length > 0) {
        const newErrors: Record<string, string> = {};
        validationErrors.forEach(error => {
          newErrors[error.field] = error.message;
        });
        setErrors(newErrors);
        
        // Mark all fields as touched
        const newTouched: Record<string, boolean> = {};
        Object.keys(values).forEach(key => {
          newTouched[key] = true;
        });
        setTouched(newTouched);

        notificationService.error(ValidationService.formatValidationErrors(validationErrors));
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      notificationService.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    reset
  };
}
