import type { Officer } from '../../types/officer';
import { isCommandRank } from '../../types/officer';
import Card from '../common/Card';

interface OfficerGroupProps {
  title: string;
  officers: Officer[];
  onEdit: (officer: Officer) => void;
}

const OfficerGroup = ({ title, officers, onEdit }: OfficerGroupProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Card>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {officers.map((officer, index) => (
            <div key={`${officer.badgeNumber}-${index}`} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
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
      </Card>
    </div>
  );
};

export default OfficerGroup;
