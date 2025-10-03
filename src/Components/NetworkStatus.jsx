import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Function to handle online status
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('You are back online!');
    };

    // Function to handle offline status
    const handleOffline = () => {
      setIsOnline(false);
      toast('You are offline. Please check your connection.', {
        icon: '📶',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration: 5000, // longer duration for important message
      });
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Only render a component when offline
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-16 left-0 right-0 flex justify-center z-50 px-4">
      <div className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zm-4.95 4.95a1 1 0 00-1.414 0L10 12.586l-2-2a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
        </svg>
        You are offline. Please check your internet connection.
      </div>
    </div>
  );
}

export default NetworkStatus;