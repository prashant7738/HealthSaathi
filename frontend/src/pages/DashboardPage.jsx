import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import apiClient from '../services/api';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalSessions: 0,
    highRiskCount: 0,
    mediumRiskCount: 0,
    lowRiskCount: 0,
    recentSessions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/stats/');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return 'from-red-500 to-red-600';
      case 'MEDIUM':
        return 'from-yellow-500 to-yellow-600';
      case 'LOW':
        return 'from-green-500 to-green-600';
      default:
        return 'from-primary-500 to-primary-600';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return <AlertCircle className="w-5 h-5" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5" />;
      case 'LOW':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white border-b border-primary-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-primary-900 flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-primary-600" />
          {t('dashboard.title')}
        </h1>
        <p className="text-primary-600 mt-1">{t('dashboard.yourStats')}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-primary-600 text-lg">{t('common.loading')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Sessions */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-primary-600 text-sm font-medium">{t('dashboard.totalSessions')}</p>
                    <h3 className="text-3xl font-bold text-primary-900 mt-1">
                      {stats.totalSessions || 0}
                    </h3>
                  </div>
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
              </div>

              {/* High Risk */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">{t('dashboard.highRiskCount')}</p>
                    <h3 className="text-3xl font-bold text-red-900 mt-1">
                      {stats.highRiskCount || 0}
                    </h3>
                  </div>
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              {/* Medium Risk */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">{t('dashboard.mediumRiskCount')}</p>
                    <h3 className="text-3xl font-bold text-yellow-900 mt-1">
                      {stats.mediumRiskCount || 0}
                    </h3>
                  </div>
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              {/* Low Risk */}
              <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">{t('dashboard.lowRiskCount')}</p>
                    <h3 className="text-3xl font-bold text-green-900 mt-1">
                      {stats.lowRiskCount || 0}
                    </h3>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  {t('dashboard.recentAnalyses')}
                </h2>
              </div>

              <div className="overflow-x-auto">
                {stats.recentSessions && stats.recentSessions.length > 0 ? (
                  <table className="w-full">
                    <thead className="bg-primary-50 border-b border-primary-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">
                          {t('chat.symptoms')}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">
                          {t('chat.riskLevel')}
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentSessions.map((session, index) => (
                        <tr key={index} className="border-b border-primary-100 hover:bg-primary-50">
                          <td className="px-6 py-4 text-sm text-primary-600">
                            {session.symptoms?.substring(0, 50)}...
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-white text-xs font-bold inline-flex items-center gap-1 bg-gradient-to-r ${getRiskColor(
                                session.risk_level
                              )}`}
                            >
                              {getRiskIcon(session.risk_level)}
                              {session.risk_level}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-primary-600">
                            {new Date(session.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-primary-600">
                    <p>{t('dashboard.noData')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
