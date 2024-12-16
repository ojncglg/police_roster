import LoginForm from '../components/auth/LoginForm';

const LoginView = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">NCCPD Roster System</h1>
        <p className="mt-2 text-gray-600">Administrative Portal</p>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginView;
