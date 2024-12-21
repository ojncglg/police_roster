/**
 * @file LoginForm.tsx
 * @description Form component for user authentication that handles login credentials
 * and provides feedback for the login process.
 */

import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

/**
 * LoginForm Component
 * 
 * @description Provides a form interface for user authentication with:
 * - Username and password input fields
 * - Form validation
 * - Error handling and display
 * - Navigation after successful login
 * 
 * The component uses local state for form management and integrates with
 * the authentication service for login operations.
 */
const LoginForm = () => {
    // Form state management
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // Navigation hook for redirecting after login
    const navigate = useNavigate();

    /**
     * Form submission handler
     * 
     * @param {FormEvent} e - Form submission event
     * 
     * Handles:
     * 1. Form validation
     * 2. Authentication attempt
     * 3. Error display
     * 4. Navigation on success
     */
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Validate required fields
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }

        // Attempt login through auth service
        authService
            .login({ username, password })
            .then(() => {
                // Navigate to roster page on successful login
                navigate('/roster');
            })
            .catch((err: Error) => {
                // Display error message on failed login
                setError(err.message);
            });
    };

    return (
        <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-6">
                    {/* Form Header */}
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
                        NCCPD Admin Login
                    </h2>

                    {/* Error Message Display */}
                    {error && (
                        <p className="text-red-500 text-sm mb-4 text-center">
                            {error}
                        </p>
                    )}

                    {/* Username Input Field */}
                    <div className="mb-4">
                        <label 
                            className="block text-gray-700 text-sm font-bold mb-2" 
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="username"
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Password Input Field */}
                    <div className="mb-6">
                        <label 
                            className="block text-gray-700 text-sm font-bold mb-2" 
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" 
                            type="submit"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </form>

            {/* Demo Credentials Info */}
            <p className="text-center text-gray-500 text-xs">
                Available admins: admin1, admin2, admin3, admin4 (password same as username)
            </p>
        </div>
    );
};

export default LoginForm;
