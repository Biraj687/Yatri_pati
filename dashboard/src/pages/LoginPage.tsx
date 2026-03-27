/**
 * Login Page - Dashboard Authentication
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@context/NotificationContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual authentication API call
      // For now, use mock authentication
      if (email && password.length >= 6) {
        // Store token in localStorage
        localStorage.setItem('dashboardAuthToken', 'mock-token-' + Date.now());
        localStorage.setItem('dashboardUser', JSON.stringify({
          email,
          role: 'admin',
          name: email.split('@')[0],
        }));

        showNotification('Login successful!', 'success');
        navigate('/');
      } else {
        showNotification('Invalid email or password', 'error');
      }
    } catch (error) {
      showNotification((error as Error).message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Dashboard Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Demo credentials:
              <br />
              Email: <strong>admin@example.com</strong>
              <br />
              Password: <strong>password123</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
