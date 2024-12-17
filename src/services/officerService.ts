import { Officer, OfficerFormData } from '../types/officer';

const STORAGE_KEY = 'nccpd_officers';

class OfficerService {
  private static instance: OfficerService;

  private constructor() {}

  public static getInstance(): OfficerService {
    if (!OfficerService.instance) {
      OfficerService.instance = new OfficerService();
    }
    return OfficerService.instance;
  }

  private getOfficers(): Officer[] {
    const officersJson = localStorage.getItem(STORAGE_KEY);
    return officersJson ? JSON.parse(officersJson) : [];
  }

  private saveOfficers(officers: Officer[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(officers));
  }

  public createOfficer(officerData: OfficerFormData): Officer {
    const officers = this.getOfficers();
    
    // Validate badge number uniqueness
    if (officers.some(o => o.badgeNumber === officerData.badgeNumber)) {
      throw new Error('Badge number already exists');
    }

    const now = new Date().toISOString();
    const newOfficer: Officer = {
      ...officerData,
      id: `off_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    officers.push(newOfficer);
    this.saveOfficers(officers);
    return newOfficer;
  }

  public updateOfficer(id: string, officerData: Partial<OfficerFormData>): Officer {
    const officers = this.getOfficers();
    const index = officers.findIndex(o => o.id === id);
    
    if (index === -1) {
      throw new Error('Officer not found');
    }

    // Validate badge number uniqueness if it's being updated
    if (officerData.badgeNumber && 
        officers.some(o => o.badgeNumber === officerData.badgeNumber && o.id !== id)) {
      throw new Error('Badge number already exists');
    }

    const updatedOfficer: Officer = {
      ...officers[index],
      ...officerData,
      updatedAt: new Date().toISOString()
    };

    officers[index] = updatedOfficer;
    this.saveOfficers(officers);
    return updatedOfficer;
  }

  public deleteOfficer(id: string): void {
    const officers = this.getOfficers();
    const filteredOfficers = officers.filter(o => o.id !== id);
    
    if (filteredOfficers.length === officers.length) {
      throw new Error('Officer not found');
    }

    this.saveOfficers(filteredOfficers);
  }

  public getOfficer(id: string): Officer | undefined {
    return this.getOfficers().find(o => o.id === id);
  }

  public getAllOfficers(): Officer[] {
    return this.getOfficers();
  }

  public getActiveOfficers(): Officer[] {
    return this.getOfficers().filter(o => o.status === 'active');
  }

  public getOfficersByZone(zoneId: string): Officer[] {
    return this.getOfficers().filter(o => o.zoneId === zoneId);
  }

  public getOfficersBySector(sectorId: string): Officer[] {
    return this.getOfficers().filter(o => o.sectorId === sectorId);
  }

  public getOfficersBySpecialAssignment(assignmentId: string): Officer[] {
    return this.getOfficers().filter(o => 
      o.specialAssignments.includes(assignmentId)
    );
  }

  public searchOfficers(query: string): Officer[] {
    const searchTerm = query.toLowerCase();
    return this.getOfficers().filter(officer => 
      officer.firstName.toLowerCase().includes(searchTerm) ||
      officer.lastName.toLowerCase().includes(searchTerm) ||
      officer.badgeNumber.toLowerCase().includes(searchTerm) ||
      officer.rank.toLowerCase().includes(searchTerm)
    );
  }

  public validateOfficerData(data: Partial<OfficerFormData>): string[] {
    const errors: string[] = [];

    if (!data.badgeNumber?.trim()) {
      errors.push('Badge number is required');
    } else if (!/^\d{1,6}$/.test(data.badgeNumber)) {
      errors.push('Badge number must be 1-6 digits');
    }

    if (!data.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!data.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!data.rank?.trim()) {
      errors.push('Rank is required');
    }

    if (!data.zoneId?.trim()) {
      errors.push('Zone assignment is required');
    }

    if (!data.sectorId?.trim()) {
      errors.push('Sector assignment is required');
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Invalid email format');
    }

    if (data.phone && !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
      errors.push('Invalid phone number format');
    }

    return errors;
  }
}

export const officerService = OfficerService.getInstance();
