import { Link } from 'react-router-dom';

const ApproveVacationButton = () => {
    return (
        <Link to="/dashboard/approve-vacation" className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="text-police-yellow">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <title>Approve Vacation</title>
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </div>
            <div>
                <div className="font-medium text-gray-900 dark:text-white">Approve Vacation</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Approve vacation requests</div>
            </div>
        </Link>
    );
};

export default ApproveVacationButton;
