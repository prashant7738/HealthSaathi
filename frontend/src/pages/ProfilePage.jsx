import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Droplet, AlertCircle, Edit2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.first_name || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    bloodType: '',
    allergies: '',
    medications: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    // Save profile changes (would call API)
    setIsEditing(false);
    // toast.success(t('messages.updatedSuccessfully'));
  };

  const InfoField = ({ icon: Icon, label, value, name, editable = false }) => (
    <div className="flex items-start gap-4 p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition">
      <div className="bg-primary-100 p-3 rounded-lg">
        <Icon className="w-5 h-5 text-primary-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-primary-600">{label}</p>
        {editable && isEditing ? (
          <input
            type="text"
            name={name}
            value={value}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          />
        ) : (
          <p className="text-lg font-semibold text-primary-900 mt-1">
            {value || <span className="text-primary-400 text-sm">Not set</span>}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white border-b border-primary-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-900">{t('profile.title')}</h1>
              <p className="text-primary-600 mt-1">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition"
          >
            {isEditing ? (
              <>
                <Save className="w-5 h-5" />
                {t('common.save')}
              </>
            ) : (
              <>
                <Edit2 className="w-5 h-5" />
                {t('profile.editProfile')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-primary-600" />
              {t('profile.personalInfo')}
            </h2>
            <div className="space-y-3">
              <InfoField
                icon={User}
                label={t('auth.name')}
                value={profile.name}
                name="name"
                editable={true}
              />
              <InfoField
                icon={Mail}
                label={t('profile.email')}
                value={profile.email}
                name="email"
                editable={false}
              />
              <InfoField
                icon={Phone}
                label={t('profile.phone')}
                value={profile.phone}
                name="phone"
                editable={true}
              />
              <InfoField
                icon={Calendar}
                label={t('profile.dateOfBirth')}
                value={profile.dateOfBirth}
                name="dateOfBirth"
                editable={true}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-primary-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary-600" />
              {t('profile.medicalHistory')}
            </h2>
            <div className="space-y-3">
              <InfoField
                icon={Droplet}
                label={t('profile.bloodType')}
                value={profile.bloodType}
                name="bloodType"
                editable={true}
              />
              <div className="p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition">
                <p className="text-sm font-medium text-primary-600">{t('profile.allergies')}</p>
                {isEditing ? (
                  <textarea
                    name="allergies"
                    value={profile.allergies}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    rows="3"
                  />
                ) : (
                  <p className="text-lg font-semibold text-primary-900 mt-2">
                    {profile.allergies || <span className="text-primary-400 text-sm">Not set</span>}
                  </p>
                )}
              </div>
              <div className="p-4 border border-primary-200 rounded-lg hover:bg-primary-50 transition">
                <p className="text-sm font-medium text-primary-600">{t('profile.currentMedications')}</p>
                {isEditing ? (
                  <textarea
                    name="medications"
                    value={profile.medications}
                    onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    rows="3"
                  />
                ) : (
                  <p className="text-lg font-semibold text-primary-900 mt-2">
                    {profile.medications || <span className="text-primary-400 text-sm">Not set</span>}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 border border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition font-medium"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition font-medium"
              >
                {t('common.save')}
              </button>
            </div>
          )}

          {/* Help & Support */}
          <div className="bg-primary-50 rounded-xl p-6 border border-primary-200">
            <h3 className="text-lg font-bold text-primary-900 mb-4">Help & Support</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-3 hover:bg-primary-100 rounded-lg transition text-primary-700 font-medium">
                {t('profile.privacyPolicy')}
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-primary-100 rounded-lg transition text-primary-700 font-medium">
                {t('profile.termsOfService')}
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-primary-100 rounded-lg transition text-primary-700 font-medium">
                {t('profile.about')} (v1.0.0)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
