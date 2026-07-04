import { useState } from 'react';
import { User, Shield, Sliders, Save, Key, Mail, DollarSign, Calendar } from 'lucide-react';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [isLoading, setIsLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  const [prefForm, setPrefForm] = useState({
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    monthlyBudget: '50000',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrefChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrefForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API call to your Django backend profile/preferences endpoint goes here
      await new Promise((resolve) => setTimeout(resolve, 800)); 
      alert('Settings updated successfully!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your profile dashboard preferences and configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 bg-white p-2 border border-gray-100 rounded-2xl shadow-sm h-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User className="w-4 h-4" />
            Account Profile
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'preferences'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Preferences & Budget
          </button>
        </div>

        {/* Content Box Panel */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'profile' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Personal Information</h3>
                <Input
                  label="Full Name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  leftIcon={<User className="w-4 h-4 text-gray-400" />}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
                />
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Change Password</h4>
                  <p className="text-xs text-gray-500 mb-4">Update your password parameters directly through security protocols.</p>
                  <Button type="button" variant="outline" leftIcon={<Key className="w-4 h-4" />}>
                    Trigger Secure Reset
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">Application Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Select
                    label="Primary Currency Symbol"
                    name="currency"
                    value={prefForm.currency}
                    onChange={handlePrefChange}
                    options={[
                      { value: 'INR', label: 'INR (₹)' },
                      { value: 'USD', label: 'USD ($)' },
                      { value: 'EUR', label: 'EUR (€)' },
                    ]}
                  />
                  <Select
                    label="Date Format System"
                    name="dateFormat"
                    value={prefForm.dateFormat}
                    onChange={handlePrefChange}
                    options={[
                      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                      { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    ]}
                  />
                </div>
                <Input
                  label="Target Monthly Spending Budget (INR)"
                  name="monthlyBudget"
                  type="number"
                  value={prefForm.monthlyBudget}
                  onChange={handlePrefChange}
                  leftIcon={<DollarSign className="w-4 h-4 text-gray-400" />}
                />
              </div>
            )}

            <div className="flex items-center justify-end pt-6 border-t border-gray-100">
              <Button type="submit" isLoading={isLoading} leftIcon={<Save className="w-4 h-4" />}>
                Save Config Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;