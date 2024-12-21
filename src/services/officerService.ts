import type { Officer, OfficerFormData } from '../types/officer';

interface OfficerServiceInterface {
  getOfficers(): Officer[];
  getAllOfficers(): Officer[];
  createOfficer(data: OfficerFormData): Promise<Officer>;
  updateOfficer(id: string, data: OfficerFormData): Promise<Officer>;
  deleteOfficer(id: string): Promise<void>;
  validateOfficerData(data: OfficerFormData): string[];
  getOfficersByDistrict(district: string): Officer[];
  getCommandStaff(): Officer[];
  addChangeListener(listener: OfficerChangeListener): void;
  removeChangeListener(listener: OfficerChangeListener): void;
}

type OfficerChangeListener = () => void;

class OfficerService implements OfficerServiceInterface {
  private officers: Officer[] = [];
  private readonly storageKey = 'nccpd_officers';
  private listeners: Set<OfficerChangeListener> = new Set();

  constructor() {
    // Load initial data from localStorage
    const storedData = localStorage.getItem(this.storageKey);
    if (storedData) {
      this.officers = JSON.parse(storedData);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.officers));
    this.notifyListeners();
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  addChangeListener(listener: OfficerChangeListener): void {
    this.listeners.add(listener);
  }

  removeChangeListener(listener: OfficerChangeListener): void {
    this.listeners.delete(listener);
  }

  getOfficers(): Officer[] {
    return [...this.officers]; // Return a copy to prevent direct mutations
  }

  getAllOfficers(): Officer[] {
    return [...this.officers]; // Return a copy to prevent direct mutations
  }

  async createOfficer(data: OfficerFormData): Promise<Officer> {
    const newOfficer: Officer = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };
    this.officers.push(newOfficer);
    this.saveToStorage();
    return newOfficer;
  }

  async updateOfficer(id: string, data: OfficerFormData): Promise<Officer> {
    const index = this.officers.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Officer not found');
    }
    
    const updatedOfficer: Officer = {
      ...this.officers[index],
      ...data,
      id // Ensure id is preserved
    };
    this.officers[index] = updatedOfficer;
    this.saveToStorage();
    return updatedOfficer;
  }

  async deleteOfficer(id: string): Promise<void> {
    const index = this.officers.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Officer not found');
    }
    this.officers.splice(index, 1);
    this.saveToStorage();
  }

  validateOfficerData(data: OfficerFormData): string[] {
    const errors: string[] = [];

    if (!data.badgeNumber) {
      errors.push('Badge number is required');
    }
    if (!data.firstName) {
      errors.push('First name is required');
    }
    if (!data.lastName) {
      errors.push('Last name is required');
    }
    if (!data.rank) {
      errors.push('Rank is required');
    }
    if (!data.zone) {
      errors.push('Zone is required');
    }
    if (!data.sector) {
      errors.push('Sector is required');
    }
    if (data.email && !this.isValidEmail(data.email)) {
      errors.push('Invalid email format');
    }
    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone format');
    }

    return errors;
  }

  getOfficersByDistrict(district: string): Officer[] {
    return this.officers.filter(officer => officer.sector.includes(district));
  }

  getCommandStaff(): Officer[] {
    return this.officers.filter(officer => 
      officer.rank.includes('Chief') || officer.rank.includes('Captain')
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  }
}

export const officerService = new OfficerService();
