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
}

class OfficerService implements OfficerServiceInterface {
  private officers: Officer[] = [];

  getOfficers(): Officer[] {
    return this.officers;
  }

  getAllOfficers(): Officer[] {
    return this.officers;
  }

  async createOfficer(data: OfficerFormData): Promise<Officer> {
    const newOfficer: Officer = {
      id: Math.random().toString(36).substr(2, 9),
      ...data
    };
    this.officers.push(newOfficer);
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
    return updatedOfficer;
  }

  async deleteOfficer(id: string): Promise<void> {
    const index = this.officers.findIndex(o => o.id === id);
    if (index === -1) {
      throw new Error('Officer not found');
    }
    this.officers.splice(index, 1);
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
