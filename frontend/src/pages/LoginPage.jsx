import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { login as authLogin } from '../services/triageService';

export default function LoginPage() {
  const { t } = useApp();
  const navigate = useNavigate();
  const { login } = useApp();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (errorData) => {
    if (typeof errorData === 'string') return errorData;
    if (typeof errorData === 'object' && errorData !== null) {
      const firstField = Object.keys(errorData)[0];
      if (firstField && Array.isArray(errorData[firstField])) {
        return errorData[firstField][0];
      }
      if (errorData.error) return typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
      return Object.values(errorData).flat()[0] || 'An error occurred';
    }
    return 'Login failed. Please try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(t.auth?.emptyFieldError || 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authLogin(email, password);
      // Call context login to save user and token
      login(
        { id: response.user.id, name: response.user.first_name || response.user.username, email: response.user.email },
        response.token
      );
      navigate('/chat');
    } catch (err) {
      const errorMsg = getErrorMessage(err.response?.data);
      setError(errorMsg);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-white">
      {/* Header with Nepal flag colors */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white p-6 pt-12 pb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t.auth?.loginTitle || 'Login'}</h1>
            <p className="text-white/80 text-sm mt-1">{t.auth?.loginSubtitle || 'Welcome back to NepalCare AI'}</p>
          </div>
          {/* Nepal flag colors accent */}
          <div className="flex gap-1">
            <div className="h-1.5 flex-1 rounded-sm bg-nepal-red" />
            <div className="h-1.5 flex-1 rounded-sm bg-white" />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.auth?.emailLabel || 'Email'}
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth?.emailPlaceholder || 'your@email.com'}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t.auth?.passwordLabel || 'Password'}
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-3.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth?.passwordPlaceholder || 'Enter your password'}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zM10 3c-4.478 0-8.268 2.943-9.542 7 .69 2.095 2.1 3.957 3.856 5.348l-1.885 1.885C2.126 14.729 1 12.554 1 10c0-4.478 3.268-8.268 7-9.542h2c4.478 0 8.268 3.268 9.542 7a9.96 9.96 0 01-1.15 2.94l2.05 2.05A9.95 9.95 0 0020 10c0 4.478-3.268 8.268-7 9.542h-2c-4.478 0-8.268-3.268-9.542-7a10.002 10.002 0 011.15-2.94z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-800 hover:bg-primary-900 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.auth?.loggingIn || 'Logging in...'}
              </>
            ) : (
              t.auth?.loginButton || 'Login'
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 border-t border-gray-200 text-center">
        <p className="text-gray-600 text-sm">
          {t.auth?.noAccount || "Don't have an account?"}{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            {t.auth?.registerLink || 'Register'}
          </Link>
        </p>
      </div>
    </div>
  );
}
