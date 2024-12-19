import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import DailyRosterComponent from '../components/roster/DailyRosterView';
import type { DailyRosterProps } from '../types/dailyRoster';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DailyRosterView = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rosterData, setRosterData] = useState<DailyRosterProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRosterData = async () => {
      setLoading(true);
      try {
        const dateParam = searchParams.get('date');
        
        // If no date parameter, redirect to demo date
        if (!dateParam) {
          navigate(`/dashboard/daily-roster?date=2024-12-15`, { replace: true });
          return;
        }

        // For demo purposes, show example data for December 15, 2024
        if (dateParam === '2024-12-15' || dateParam === '12/15/2024') {
          setRosterData({
            date: '12/15/2024',
            dayOfWeek: 'Sunday',
            tour: 'NIGHT',
            fullStaffing: 42,
            patrolToday: 29,
            commandStaff: [{
              name: 'S/LT. ZEISSIG',
              ibm: '2413',
              unit: '',
              shift: '1500 to 0215',
              assignment: 'Retired'
            }],
            districts: [
              {
                title: 'DISTRICT 1 (11/12/13/14 NORTH)',
                officers: [
                  {
                    name: 'SGT. LUCAS SWAT',
                    ibm: '2752',
                    unit: '191',
                    shift: '1900X0615'
                  },
                  {
                    name: 'LOFTUS SWAT',
                    ibm: '2936',
                    unit: '12A1',
                    shift: '1600X0315'
                  },
                  {
                    name: 'TOLAN',
                    ibm: '13172',
                    unit: '12A2',
                    shift: '1600X0315'
                  },
                  {
                    name: 'BETHEA',
                    ibm: '13162',
                    unit: '13A1',
                    shift: '1900X0615'
                  },
                  {
                    name: 'SEITLEMAN',
                    ibm: '13150',
                    unit: '13A2',
                    shift: '1900X0615'
                  },
                  {
                    name: 'JOHNSON',
                    ibm: '13169',
                    unit: '14A1',
                    shift: '1900X0615'
                  },
                  {
                    name: 'URBAN',
                    ibm: '13156',
                    unit: '14A2',
                    shift: '1900X0615',
                    assignment: 'CARGEOR'
                  },
                  {
                    name: 'WILLIAMS/HAVOC',
                    ibm: '2718',
                    unit: 'K9-1',
                    shift: '1600X0315',
                    assignment: 'SICK'
                  }
                ]
              },
              {
                title: 'DISTRICT 2 (21/22 - WEST)',
                officers: [
                  {
                    name: 'SGT. MCNASBY CNT/CIT',
                    ibm: '2880',
                    unit: '281',
                    shift: '1900X0615'
                  },
                  {
                    name: 'IULIANO',
                    ibm: '13119',
                    unit: '21A1',
                    shift: '1900X0615'
                  },
                  {
                    name: 'DEROCILI',
                    ibm: '2941',
                    unit: '21A2',
                    shift: '1600X0315'
                  },
                  {
                    name: 'CRONIN',
                    ibm: '2987',
                    unit: '21A8',
                    shift: '1600X0315',
                    assignment: 'VAC'
                  },
                  {
                    name: 'MULFORD',
                    ibm: '2986',
                    unit: '22A1',
                    shift: '1600X0315'
                  },
                  {
                    name: 'CORRIGAN PCS',
                    ibm: '13100',
                    unit: '22A8',
                    shift: '1600X0315',
                    assignment: 'VAC'
                  },
                  {
                    name: 'WOZNIAK MFF',
                    ibm: '2951',
                    unit: '22A3',
                    shift: '1900X0614',
                    assignment: 'GALAN'
                  },
                  {
                    name: 'RIVERA EDS',
                    ibm: '13024',
                    unit: '22A9',
                    shift: '1900X0615',
                    assignment: 'VAC'
                  }
                ]
              },
              {
                title: 'DISTRICT 2 (23/24 - WEST)',
                officers: [
                  {
                    name: 'S/SGT. BINGNEAR MFF',
                    ibm: '2729',
                    unit: '291',
                    shift: '1900X0615',
                    assignment: 'A/LT'
                  },
                  {
                    name: 'DIFIORI',
                    ibm: '13163',
                    unit: '23A1',
                    shift: '1900X0615'
                  },
                  {
                    name: 'COVATTO',
                    ibm: '13129',
                    unit: '23A2',
                    shift: '1600X0315'
                  },
                  {
                    name: 'VANSANT PCS CIT/CISM',
                    ibm: '13041',
                    unit: '23A8',
                    shift: '1900X0615',
                    assignment: 'DATA'
                  },
                  {
                    name: 'DENISIO',
                    ibm: '13120',
                    unit: '23A4',
                    shift: '1900X0615'
                  },
                  {
                    name: 'MATHIS',
                    ibm: '2960',
                    unit: '24A1',
                    shift: '1600X0315'
                  },
                  {
                    name: 'NICHOLSON MFF',
                    ibm: '2881',
                    unit: '24A2',
                    shift: '1600X0315',
                    assignment: '399'
                  },
                  {
                    name: 'DISABATINO',
                    ibm: '2715',
                    unit: '24A3',
                    shift: '1600X0315',
                    assignment: '299'
                  }
                ]
              },
              {
                title: 'DISTRICT 3 (31/32 NORTH CENTRAL)',
                officers: [
                  {
                    name: 'SGT. DUFFY VRT/CIT/CISM',
                    ibm: '2684',
                    unit: '381',
                    shift: '1600X0315'
                  },
                  {
                    name: 'STANEK SWAT/VRT',
                    ibm: '13145',
                    unit: '31A1',
                    shift: '1900X0615'
                  },
                  {
                    name: 'WOLFE',
                    ibm: '13117',
                    unit: '31A2',
                    shift: '1900X0615'
                  },
                  {
                    name: 'BREITHAUPT',
                    ibm: '13072',
                    unit: '31A3',
                    shift: '1900X0615'
                  },
                  {
                    name: 'AVILEZ',
                    ibm: '13030',
                    unit: '31A4',
                    shift: '1600X0315',
                    assignment: 'SICK'
                  },
                  {
                    name: 'BARTON',
                    ibm: '13153',
                    unit: '32A1',
                    shift: '1900X0615',
                    assignment: '1600-0315'
                  },
                  {
                    name: 'BUTLER',
                    ibm: '13116',
                    unit: '32A3',
                    shift: '1600X0315'
                  },
                  {
                    name: 'K. THOMPSON VRT/CIT/CISM',
                    ibm: '2919',
                    unit: '13A2',
                    shift: '1600X0315',
                    assignment: 'CSU'
                  },
                  {
                    name: 'WALKER/KONA',
                    ibm: '2903',
                    unit: 'K9-11',
                    shift: '1600X0315',
                    assignment: 'VAC'
                  }
                ]
              },
              {
                title: 'DISTRICT 3 (33/34 SOUTH CENTRAL)',
                officers: [
                  {
                    name: 'S/SGT. JACKSON',
                    ibm: '2628',
                    unit: '391',
                    shift: '1600X0315',
                    assignment: 'SICK'
                  },
                  {
                    name: 'GAMBARDELLA',
                    ibm: '13157',
                    unit: '33A1',
                    shift: '1900X0615',
                    assignment: 'MILIT'
                  },
                  {
                    name: 'WILLIAMS PCS',
                    ibm: '13038',
                    unit: '33A8',
                    shift: '1900X0615'
                  },
                  {
                    name: 'SIMPSON',
                    ibm: '2923',
                    unit: '33A3',
                    shift: '1900X0615'
                  },
                  {
                    name: 'MIHALYI MFF',
                    ibm: '2900',
                    unit: '33A4',
                    shift: '1600X0315'
                  },
                  {
                    name: 'LOPEZ-GARCIA',
                    ibm: '2886',
                    unit: '34A1',
                    shift: '1600X0315'
                  },
                  {
                    name: 'McCAUSLAND EOD/VRT',
                    ibm: '2853',
                    unit: '34A2',
                    shift: '1600X0315'
                  },
                  {
                    name: 'GROVER',
                    ibm: '2847',
                    unit: '34A3',
                    shift: '1600X0315'
                  },
                  {
                    name: 'FITZWATER EDS',
                    ibm: '2672',
                    unit: '34A9',
                    shift: '1600X0315',
                    assignment: 'TURNKEY'
                  }
                ]
              },
              {
                title: 'DISTRICT 4 (41/42/43 and CRT)',
                officers: [
                  {
                    name: 'PLUTA',
                    ibm: '2756',
                    unit: '41A1',
                    shift: '1900X0615'
                  },
                  {
                    name: 'KOPANSKI',
                    ibm: '2578',
                    unit: '42A1',
                    shift: '1600X0315'
                  },
                  {
                    name: 'BLITHE',
                    ibm: '2745',
                    unit: '43A1',
                    shift: '1600X0315',
                    assignment: 'VAC'
                  }
                ]
              },
              {
                title: 'TAC/CRT',
                officers: [
                  {
                    name: 'WILHELM',
                    ibm: '13140',
                    unit: 'CRT 13',
                    shift: '1600X0315',
                    assignment: 'WEST'
                  },
                  {
                    name: 'DVORAK',
                    ibm: '13107',
                    unit: 'CRT 14',
                    shift: '1600X0315',
                    assignment: 'VAC'
                  }
                ]
              }
            ]
          });
        } else {
          // For other dates, show empty roster with message
          const date = new Date(dateParam);
          setRosterData({
            date: date.toLocaleDateString(),
            dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }),
            tour: 'N/A',
            fullStaffing: 0,
            patrolToday: 0,
            commandStaff: [{
              name: 'N/A',
              ibm: '',
              unit: '',
              shift: 'N/A',
              assignment: ''
            }],
            districts: []
          });
        }
      } catch (error) {
        console.error('Error loading roster data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRosterData();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!rosterData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Roster Data</h2>
        <p className="text-gray-600 dark:text-gray-400">
          No roster data is available for the selected date.
        </p>
      </div>
    );
  }

  return <DailyRosterComponent {...rosterData} />;
};

export default DailyRosterView;
