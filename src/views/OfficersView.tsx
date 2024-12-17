import { withAuth } from '../hocs/withAuth';
import OfficerList from '../components/officers/OfficerList';
import Card from '../components/common/Card';
import { CardHeader } from '../components/common/Card';
import { useAuth } from '../hooks/useAuth';

const OfficersView = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-police-black to-gray-800 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {user?.username}
        </h1>
        <p className="text-gray-300">
          Manage officer information and assignments in the NCCPD roster system.
        </p>
      </div>

      {/* Officer Management Section */}
      <Card>
        <CardHeader
          title="Officer Management"
          subtitle="Add, edit, and manage officer information"
          action={
            <div className="text-sm text-gray-500">
              Last login: {new Date(user?.lastLogin || '').toLocaleString()}
            </div>
          }
        />
        <div className="mt-4">
          <OfficerList />
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Active Officers</h3>
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" 
                />
              </svg>
              <span className="text-3xl font-bold">25</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">On Duty Today</h3>
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              <span className="text-3xl font-bold">12</span>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Special Assignments</h3>
            <div className="flex items-center">
              <svg 
                className="w-8 h-8 mr-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
                />
              </svg>
              <span className="text-3xl font-bold">8</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Wrap the component with authentication HOC
export default withAuth(OfficersView);
