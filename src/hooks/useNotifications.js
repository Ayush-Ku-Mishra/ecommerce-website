import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Context } from '../main';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(Context);
  
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchNotifications = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      
      // Fetch client notifications
      const clientResponse = await axios.get(
        `${API_BASE_URL}/api/v1/client-notifications/user`,
        { withCredentials: true }
      );
      
      // Fetch admin-generated notifications related to this user
      const adminResponse = await axios.get(
        `${API_BASE_URL}/api/v1/client-notifications/user/admin-updates`,
        { withCredentials: true }
      );
      
      if (clientResponse.data.success && adminResponse.data.success) {
        // Combine both types of notifications
        const allNotifications = [
          ...clientResponse.data.notifications,
          ...adminResponse.data.notifications
        ];
        
        // Sort by creation date (newest first)
        allNotifications.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setNotifications(allNotifications);
        
        // Calculate total unread count
        setUnreadCount(
          clientResponse.data.unreadCount + adminResponse.data.unreadCount
        );
      } else if (clientResponse.data.success) {
        // If only client notifications succeeded
        setNotifications(clientResponse.data.notifications);
        setUnreadCount(clientResponse.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      // Determine if it's a client or admin notification
      const notification = notifications.find(n => n._id === notificationId);
      
      if (!notification) return;
      
      // Choose the appropriate endpoint based on notification source
      const endpoint = notification.source === 'admin'
        ? `${API_BASE_URL}/api/v1/notifications/mark-read/${notificationId}`
        : `${API_BASE_URL}/api/v1/client-notifications/user/mark-read/${notificationId}`;
      
      await axios.put(endpoint, {}, { withCredentials: true });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all client notifications as read
      await axios.put(
        `${API_BASE_URL}/api/v1/client-notifications/user/mark-all-read`,
        {},
        { withCredentials: true }
      );
      
      // Mark all admin notifications for this user as read
      await axios.put(
        `${API_BASE_URL}/api/v1/client-notifications/user/mark-all-admin-read`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Determine if it's a client or admin notification
      const notification = notifications.find(n => n._id === notificationId);
      
      if (!notification) return;
      
      // Choose the appropriate endpoint based on notification source
      const endpoint = notification.source === 'admin'
        ? `${API_BASE_URL}/api/v1/notifications/delete/${notificationId}`
        : `${API_BASE_URL}/api/v1/client-notifications/user/delete/${notificationId}`;
      
      await axios.delete(endpoint, { withCredentials: true });
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notif => notif._id !== notificationId)
      );
      
      // Update unread count if needed
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications
  };
};