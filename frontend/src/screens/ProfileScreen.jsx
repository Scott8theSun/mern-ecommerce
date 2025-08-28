import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
    });
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-600"
            />
            <p className="text-sm text-gray-500 mt-1">Name cannot be changed</p>
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-600"
            />
            <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Account Type
            </label>
            <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-600">
              {user.isAdmin ? 'Administrator' : 'Customer'}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">
              Member Since
            </label>
            <div className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-600">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate('/myorders')}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">View My Orders</h4>
                  <p className="text-sm text-gray-600">Check your order history and status</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-800">Continue Shopping</h4>
                  <p className="text-sm text-gray-600">Browse our product catalog</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
