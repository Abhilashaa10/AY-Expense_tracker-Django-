import { useAuth } from '../hooks/useAuth';
import { User, LogOut } from 'lucide-react';
import Button from '../components/common/Button';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Your account details</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.username}</h2>
            <p className="text-gray-500 text-sm">Personal Account</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between py-3">
            <span className="text-gray-600">Username</span>
            <span className="font-medium text-gray-900">{user?.username}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-t border-gray-50">
            <span className="text-gray-600">Account Type</span>
            <span className="font-medium text-gray-900">Free</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">Account Actions</h3>
        <Button
          variant="outline"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={logout}
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;