import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { Activity, MessageCircle, MapPin, BarChart3, User, Globe } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { changeLanguage, currentLanguage } = useLanguage();

  const menuItems = [
    { path: '/chat', icon: MessageCircle, label: t('navigation.chat') },
    { path: '/map', icon: MapPin, label: t('navigation.map') },
    { path: '/dashboard', icon: BarChart3, label: t('navigation.dashboard') },
    { path: '/profile', icon: User, label: t('navigation.profile') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-primary-200 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-primary-200">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/chat')}>
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2.5 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-primary-900">{t('common.appName')}</h1>
            <p className="text-xs text-primary-600">{t('common.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                isActive(item.path)
                  ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600'
                  : 'text-primary-600 hover:bg-primary-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Language Settings */}
      <div className="border-t border-primary-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-primary-600" />
          <span className="text-sm font-medium text-primary-900">{t('profile.language')}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => changeLanguage('en')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              currentLanguage === 'en'
                ? 'bg-primary-500 text-white'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => changeLanguage('ne')}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
              currentLanguage === 'ne'
                ? 'bg-primary-500 text-white'
                : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
            }`}
          >
            नेपाली
          </button>
        </div>
      </div>
    </div>
  );
}
