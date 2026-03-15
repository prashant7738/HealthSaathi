import { useState } from 'react';
import { Lock, Bell, User, Mail, Phone, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationToggle from '../components/NotificationToggle';

export default function ProfilePage() {
  const { t, user, setUser } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    reminders: true,
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const tabs = [
    { id: 'profile', label: t.profile.profileInformation },
    { id: 'notifications', label: t.profile.notifications },
    { id: 'security', label: t.profile.security },
  ];

  const handleProfileChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  const handleNotificationChange = (id) => {
    setNotifications({ ...notifications, [id]: !notifications[id] });
  };

  return (
    <div className="overflow-auto h-full bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t.profile.title}</h1>
          <p className="text-gray-500 mt-1">{t.profile.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'text-cyan-500 border-b-2 border-cyan-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              {/* Avatar Section */}
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                  {user.avatar || 'JD'}
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{user.name || 'John Doe'}</h3>
                    <p className="text-gray-600 text-sm">{user.email || 'john.doe@example.com'}</p>
                  </div>
                  <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium w-fit">
                    {t.profile.changePhoto}
                  </button>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    {t.profile.fullName}
                  </label>
                  <input
                    type="text"
                    value={user.name || 'John Doe'}
                    onChange={(e) => handleProfileChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    {t.profile.emailAddress}
                  </label>
                  <input
                    type="email"
                    value={user.email || 'john.doe@example.com'}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {t.profile.phoneNumber}
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    {t.profile.dateOfBirth}
                  </label>
                  <input
                    type="date"
                    defaultValue="1990-01-15"
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {t.profile.address}
                </label>
                <input
                  type="text"
                  defaultValue="123 Main St, New York, NY 10001"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                />
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <AlertCircle size={16} className="text-gray-400" />
                  {t.profile.emergencyContact}
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 987-6543"
                  className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                />
              </div>

              <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium flex items-center gap-2">
                <span className="flex">💾</span>
                {t.profile.saveChanges}
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Bell size={20} className="text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">{t.profile.notificationPreferences}</h3>
              </div>

              <NotificationToggle
                title={t.profile.emailNotifications}
                description={t.profile.emailNotificationsDesc}
                enabled={notifications.email}
                onChange={() => handleNotificationChange('email')}
              />

              <NotificationToggle
                title={t.profile.smsNotifications}
                description={t.profile.smsNotificationsDesc}
                enabled={notifications.sms}
                onChange={() => handleNotificationChange('sms')}
              />

              <NotificationToggle
                title={t.profile.pushNotifications}
                description={t.profile.pushNotificationsDesc}
                enabled={notifications.push}
                onChange={() => handleNotificationChange('push')}
              />

              <NotificationToggle
                title={t.profile.healthReminders}
                description={t.profile.healthRemindersDesc}
                enabled={notifications.reminders}
                onChange={() => handleNotificationChange('reminders')}
              />

              <button className="mt-8 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium flex items-center gap-2">
                <span className="flex">💾</span>
                {t.profile.savePreferences}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <Lock size={20} className="text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-800">{t.profile.securitySettings}</h3>
              </div>

              {/* Change Password */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{t.profile.changePasswordSection}</h4>
                <p className="text-sm text-gray-600 mb-6">{t.profile.changePasswordDesc}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.profile.currentPassword}
                    </label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="Enter your current password"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.profile.newPassword}
                    </label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      placeholder="Enter your new password"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.profile.confirmPassword}
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      placeholder="Confirm your new password"
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:border-cyan-500 transition-all text-gray-800"
                    />
                  </div>

                  <button className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-medium">
                    {t.profile.updatePassword}
                  </button>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Two-Factor Authentication */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">{t.profile.twoFactorAuth}</h4>
                <p className="text-sm text-gray-600 mb-4">{t.profile.twoFactorDesc}</p>
                <button className="px-6 py-3 border-2 border-cyan-500 text-cyan-500 rounded-lg hover:bg-cyan-50 transition-colors font-medium">
                  {t.profile.enable2FA}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
