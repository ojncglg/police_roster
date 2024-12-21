import type { FC } from 'react';
import type { Officer } from '../../types/officer';
import { isCommandRank } from '../../types/officer';

interface OfficerGroupListProps {
  officers: Officer[];
  onEdit: (officer: Officer) => void;
}

const OfficerGroupList: FC<OfficerGroupListProps> = ({ officers, onEdit }) => {
  const renderOfficerGroup = (title: string, groupOfficers: Officer[]) => (
    <div key={title} className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {groupOfficers.map((officer, index) => (
          <div key={`${officer.badgeNumber}-${index}`} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{officer.firstName} {officer.lastName}</span>
                <span className="text-gray-500 ml-2">({officer.badgeNumber})</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">- {officer.rank}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Zone {officer.zone}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  {isCommandRank(officer.rank) ? 
                    (officer.isOnDesk ? 'On Desk' : 'On Patrol') : 
                    `Sector ${officer.sector}`}
                </span>
                {officer.specialAssignments.length > 0 && (
                  <span className="text-blue-600 dark:text-blue-400 ml-2">
                    - {officer.specialAssignments.join(', ')}
                  </span>
                )}
              </div>
              <button 
                onClick={() => onEdit(officer)}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Group officers by their zones and command ranks
  // Use Set to track processed officers and avoid duplicates
  const processedOfficers = new Set<string>();

  const commandStaff = officers.filter(o => {
    if (isCommandRank(o.rank) && !processedOfficers.has(o.id)) {
      processedOfficers.add(o.id);
      return true;
    }
    return false;
  });

  const district1 = officers.filter(o => {
    if (!isCommandRank(o.rank) && o.zone === '1 Zone' && !processedOfficers.has(o.id)) {
      processedOfficers.add(o.id);
      return true;
    }
    return false;
  });

  const district2 = officers.filter(o => {
    if (!isCommandRank(o.rank) && o.zone === '2 Zone' && !processedOfficers.has(o.id)) {
      processedOfficers.add(o.id);
      return true;
    }
    return false;
  });

  const district3 = officers.filter(o => {
    if (!isCommandRank(o.rank) && o.zone === '3 Zone' && !processedOfficers.has(o.id)) {
      processedOfficers.add(o.id);
      return true;
    }
    return false;
  });

  const district4 = officers.filter(o => {
    if (!isCommandRank(o.rank) && o.zone === '4 Zone' && !processedOfficers.has(o.id)) {
      processedOfficers.add(o.id);
      return true;
    }
    return false;
  });

  // Special units will only show officers not already shown in other groups
  const specialUnits = officers.filter(o => 
    o.specialAssignments.length > 0 && !processedOfficers.has(o.id)
  );

  return (
    <div className="space-y-8">
      {renderOfficerGroup('Command Staff', commandStaff)}
      {renderOfficerGroup('District 1 (North)', district1)}
      {renderOfficerGroup('District 2 (West)', district2)}
      {renderOfficerGroup('District 3', district3)}
      {renderOfficerGroup('District 4', district4)}
      {renderOfficerGroup('Special Units', specialUnits)}
    </div>
  );
};

export default OfficerGroupList;
