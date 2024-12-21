import type { SickTimeRecord, SickTimeFormData } from '../types/sickTime';
import { officerService } from './officerService';

class SickTimeService {
  private sickTimeRecords: SickTimeRecord[] = [];

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  async createSickTimeRecord(type: 'sick' | 'fmla' | 'injury', data: SickTimeFormData): Promise<SickTimeRecord> {
    const officer = officerService.getOfficers().find(o => o.id === data.officerId);
    if (!officer) {
      throw new Error('Officer not found');
    }

    // Update officer status
    await officerService.updateOfficer(officer.id, {
      firstName: officer.firstName,
      lastName: officer.lastName,
      badgeNumber: officer.badgeNumber,
      rank: officer.rank,
      zone: officer.zone,
      sector: officer.sector,
      isOnDesk: officer.isOnDesk,
      specialAssignment: officer.specialAssignment || '',
      email: officer.email || '',
      phone: officer.phone || '',
      status: type,
      notes: officer.notes || '',
      specialAssignments: officer.specialAssignments,
      isActive: officer.isActive
    });

    const record: SickTimeRecord = {
      id: this.generateId(),
      officerId: data.officerId,
      type,
      dates: data.dates,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.sickTimeRecords.push(record);
    return record;
  }

  getSickTimeRecords(): SickTimeRecord[] {
    return this.sickTimeRecords;
  }

  getOfficerSickTimeRecords(officerId: string): SickTimeRecord[] {
    return this.sickTimeRecords.filter(record => record.officerId === officerId);
  }
}

export const sickTimeService = new SickTimeService();
