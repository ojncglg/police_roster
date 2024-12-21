export interface SickTimeRecord {
  id: string;
  officerId: string;
  type: 'sick' | 'fmla' | 'injury';
  dates: Date[];
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface SickTimeFormData {
  officerId: string;
  dates: Date[];
  notes?: string;
}
