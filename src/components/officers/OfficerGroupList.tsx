import type { FC } from 'react';
import type { Officer } from '../../types/officer';

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
                <span className="text-gray-600 dark:text-gray-400 ml-2">{officer.sector}</span>
                {officer.specialAssignment && (
                  <span className="text-blue-600 dark:text-blue-400 ml-2">- {officer.specialAssignment}</span>
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

  // Group officers by their ranks and sectors
  const commandStaff = officers.filter(o => 
    o.rank.includes('Chief') || o.rank.includes('Captain')
  );
  const district1 = officers.filter(o => 
    o.sector.includes('1') && !o.sector.includes('13')
  );
  const district2 = officers.filter(o => 
    o.sector.includes('2')
  );
  const district3 = officers.filter(o => 
    o.sector.includes('3')
  );
  const district4 = officers.filter(o => 
    o.sector.includes('4')
  );
  const specialUnits = officers.filter(o => 
    o.specialAssignment && o.specialAssignment.length > 0
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
