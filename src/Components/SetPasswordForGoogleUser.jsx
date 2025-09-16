// SetPasswordForGoogleUser.jsx - Create this as a new component file
import React, { useState } from 'react';
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';

const SetPasswordForGoogleUser = ({ userEmail, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const errors = {};
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password)) {
      errors.password = 'Password must include uppercase, lowercase, number, and special character';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePassword(newPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/setPasswordForGoogleUser`,
        {
          email: userEmail,
          newPassword: newPassword,
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onSuccess && onSuccess();
        onClose && onClose();
      }
    } catch (error) {
      console.error('Set password error:', error);
      toast.error(error.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Set Your Password</h2>
          <p className="text-gray-600 text-sm">
            Since you signed up with Google, you can set a password to also login with email/password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MdLock className="h-5 w-5 text-gray-600" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showPassword ? (
                <MdVisibilityOff className="h-5 w-5 text-gray-600" />
              ) : (
                <MdVisibility className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <MdLock className="h-5 w-5 text-gray-600" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full pl-12 pr-12 py-3 bg-gray-50 border rounded-xl focus:outline-none transition-all duration-200 ${
                errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-200 focus:ring-blue-500'
              } focus:border-transparent`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              {showConfirmPassword ? (
                <MdVisibilityOff className="h-5 w-5 text-gray-600" />
              ) : (
                <MdVisibility className="h-5 w-5 text-gray-600" />
              )}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-blue-800 font-medium mb-1">Password must include:</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• At least 6 characters</li>
              <li>• One uppercase letter (A-Z)</li>
              <li>• One lowercase letter (a-z)</li>
              <li>• One number (0-9)</li>
              <li>• One special character (@$!%*?&)</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Setting...' : 'Set Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordForGoogleUser;