import { initializeOfficers } from './officers';
import { officers } from './officers';
import { initialRoster } from './rosters';
import { rosterService } from '../services/rosterService';
import { officerService } from '../services/officerService';

export function initializeData(): void {
  // Initialize officers
  initializeOfficers();
  
  // Create officers in the service
  officers.forEach(async (officer) => {
    try {
      await officerService.createOfficer({
        firstName: officer.firstName,
        lastName: officer.lastName,
        badgeNumber: officer.badgeNumber,
        rank: officer.rank,
        zone: officer.zone,
        sector: officer.sector,
        specialAssignment: officer.specialAssignment || '',
        email: '',
        phone: '',
        status: officer.status,
        notes: officer.notes || '',
        specialAssignments: officer.specialAssignments,
        isActive: officer.isActive
      });
    } catch (error) {
      console.error(`Failed to create officer ${officer.badgeNumber}:`, error);
    }
  });

  // Initialize roster with the created officers
  const rosterWithOfficers = {
    ...initialRoster,
    officers: officers
  };

  // Create the roster in the service
  try {
    rosterService.createRoster(rosterWithOfficers);
  } catch (error) {
    console.error('Failed to create roster:', error);
  }
}
