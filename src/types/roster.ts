export type Shift = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
};

export type Officer = {
  id: string;
  badgeNumber: string;
  name: string;
  rank: string;
  unit: string;
};

export type ShiftAssignment = {
  shiftId: string;
  officerId: string;
  date: string;
  position: string;
};

export type Roster = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  shifts: Shift[];
  officers: Officer[];
  assignments: ShiftAssignment[];
};
