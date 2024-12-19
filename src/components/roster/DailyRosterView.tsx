import type { DailyRosterProps } from '../../types/dailyRoster';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';

const DailyRosterView = ({ 
  date,
  tour,
  fullStaffing,
  patrolToday,
  commandStaff,
  districts
}: DailyRosterProps) => {
  const location = useLocation();
  const [isDebugOpen, setIsDebugOpen] = useState(false);
  
  
  const TableHeader = ({ columns }: { columns: string[] }) => (
    <thead>
      <tr className="bg-gray-100 dark:bg-gray-700 print:bg-transparent">
        {columns.map((col, i) => (
          <th key={i} className="px-4 py-2 text-left border print:bg-gray-100 text-gray-900 dark:text-white">{col}</th>
        ))}
      </tr>
    </thead>
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-6xl mx-auto print:shadow-none print:p-2">
      {/* Print Button and Header */}
      <div className="flex justify-between items-center mb-4 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">NCCPD Daily Roster</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsDebugOpen(!isDebugOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded group relative ${
              isDebugOpen 
                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800' 
                : 'bg-gray-200 text-black hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'
            }`}
            aria-label={isDebugOpen ? "Hide debug information" : "Show debug information"}
            title={isDebugOpen ? "Hide debug information" : "Show debug information"}
          >
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true" role="img">
                <title>{isDebugOpen ? "Debug Mode Active" : "Debug Mode Inactive"}</title>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {isDebugOpen ? "Debug Mode On" : "Debug Mode"}
            </span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-police-yellow text-black rounded hover:bg-police-gold"
            aria-label="Print Roster"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Print</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print Roster
          </button>
        </div>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-4">
        <h1 className="text-2xl font-bold text-center">NCCPD Daily Roster</h1>
      </div>

      {/* Header Section */}
      <div className="mb-8 border-b pb-4 print:mb-4 print:pb-2">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded print:bg-transparent print:border print:border-gray-300">
            <div className="text-sm text-gray-600 dark:text-gray-300 print:text-black">Date</div>
            <div className="font-semibold text-gray-900 dark:text-white">{new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded print:bg-transparent print:border print:border-gray-300">
            <div className="text-sm text-gray-600 dark:text-gray-300 print:text-black">Tour</div>
            <div className="font-semibold text-gray-900 dark:text-white">{tour}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded print:bg-transparent print:border print:border-gray-300">
            <div className="text-sm text-gray-600 dark:text-gray-300 print:text-black">Officers Working</div>
            <div className="font-semibold text-gray-900 dark:text-white">{patrolToday} / {fullStaffing}</div>
          </div>
        </div>
      </div>

      {/* Squad Commander Section */}
      <div className="mb-8 print:mb-4">
        <h2 className="text-lg font-bold mb-4 bg-blue-600 dark:bg-blue-800 text-white p-2 print:bg-gray-200 print:text-black">Squad Commander</h2>
        {/* Debug info */}
        <details 
          className={`mb-4 text-sm text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded p-2 print:hidden bg-white dark:bg-gray-800 transition-all duration-200 transform origin-top ${
            isDebugOpen ? 'shadow-md scale-[1.01]' : ''
          }`}
          open={isDebugOpen}
          onToggle={(e) => setIsDebugOpen(e.currentTarget.open)}
        >
          <summary className="font-bold mb-2 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 flex items-center p-1 -m-1 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50">
            <svg 
              className={`w-4 h-4 mr-1 transition-all duration-200 ${isDebugOpen ? 'scale-110' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              aria-hidden="true" 
              role="img"
            >
              <title>Expand/Collapse</title>
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isDebugOpen 
                  ? "M19 9l-7 7-7-7" 
                  : "M9 5l7 7-7 7"
                } 
              />
            </svg>
            Debug Information {isDebugOpen ? '(Expanded)' : '(Collapsed)'}
          </summary>
          <table className="w-full border-collapse mt-2">
            <tbody>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-medium pr-4 py-2">Number of officers:</td>
                <td className="py-2">{commandStaff?.length || 0}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-medium pr-4 py-2">Date:</td>
                <td className="py-2">{date}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-medium pr-4 py-2">Tour:</td>
                <td className="py-2">{tour}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-medium pr-4 py-2">URL:</td>
                <td className="break-all py-2">{`${window.location.origin}${location.pathname}${location.search}`}</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="font-medium pr-4 py-2">First officer:</td>
                <td className="py-2">
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-[1.01] transform text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-all duration-200">
                    {commandStaff?.[0] ? JSON.stringify(commandStaff[0], null, 2) : 'none'}
                  </pre>
                </td>
              </tr>
              <tr>
                <td className="font-medium pr-4 py-2">All officers:</td>
                <td className="py-2">
                  <pre className="whitespace-pre-wrap font-mono text-xs bg-gray-50 hover:bg-white dark:bg-gray-900 dark:hover:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:scale-[1.01] transform text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-all duration-200">
                    {JSON.stringify(commandStaff, null, 2)}
                  </pre>
                </td>
              </tr>
            </tbody>
          </table>
        </details>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <TableHeader columns={['Name', 'IBM', 'Unit', 'Shift', 'Assignment']} />
            <tbody>
              {commandStaff?.map((officer, index) => (
                <tr key={index} className="bg-white dark:bg-gray-800">
                  <td className="px-4 py-2 border font-medium text-gray-900 dark:text-gray-200">{officer.name}</td>
                  <td className="px-4 py-2 border text-gray-900 dark:text-gray-200">{officer.ibm}</td>
                  <td className="px-4 py-2 border text-gray-900 dark:text-gray-200">{officer.unit}</td>
                  <td className="px-4 py-2 border text-gray-900 dark:text-gray-200">{officer.shift}</td>
                  <td className="px-4 py-2 border text-red-500 dark:text-red-400">{officer.assignment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Districts Sections */}
      {districts.map((district, index) => (
        <div key={index} className={`mb-8 print:mb-4 ${index > 0 ? 'print:page-break-before' : ''}`}>
          <h2 className="text-lg font-bold mb-4 bg-blue-600 dark:bg-blue-800 text-white p-2 print:bg-gray-200 print:text-black">{district.title}</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <TableHeader columns={['Name', 'IBM', 'Unit', 'Shift', 'Assignment']} />
              <tbody>
                {district.officers.map((officer, officerIndex) => (
                  <tr key={officerIndex} className={officerIndex % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                    <td className="px-4 py-2 border font-medium text-gray-900 dark:text-gray-200">{officer.name}</td>
                    <td className="px-4 py-2 border text-gray-900 dark:text-gray-200">{officer.ibm}</td>
                    <td className="px-4 py-2 border text-gray-900 dark:text-gray-200">{officer.unit}</td>
                    <td className="px-4 py-2 border text-gray-900 dark:text-gray-200">{officer.shift}</td>
                    <td className="px-4 py-2 border text-red-500 dark:text-red-400">{officer.assignment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Print-only Footer */}
      <div className="hidden print:block mt-8 text-sm text-gray-500">
        <div className="text-center">
          <p>Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default DailyRosterView;
