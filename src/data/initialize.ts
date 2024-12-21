import { officers } from './officers';
import { initialRoster } from './rosters';
import type { Roster } from '../types/roster';

export function initializeData(): void {
  const officerServiceKey = 'nccpd_officers';
  const rosterServiceKey = 'nccpd_rosters';

  // Only initialize if data doesn't exist
  if (!localStorage.getItem(officerServiceKey)) {
    // Store officers in localStorage
    localStorage.setItem(officerServiceKey, JSON.stringify(officers));

    // Initialize roster with the officers
    const roster: Roster = {
      ...initialRoster,
      id: Date.now().toString(),
      officers: officers
    };
    localStorage.setItem(rosterServiceKey, JSON.stringify([roster]));
  }
}
