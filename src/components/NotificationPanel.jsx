import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationPanel = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Get VAPID key from .env
  const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;


  useEffect(() => {
    fetchNotifications();
    initPushNotifications(); // ADD: Real-time push setup
  }, []);

  // ⭐ NEW: Real-time push notifications (popups on phone/browser)
  const initPushNotifications = async () => {
    if (!('serviceWorker' in navigator)) {
  console.log('Service Worker not supported');
  return;
}


    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered');
      await subscribeUserToPush(registration);
    } catch (error) {
      console.error('Push setup failed:', error);
    }
  };

  const subscribeUserToPush = async (registration) => {
  if (!VAPID_PUBLIC_KEY) {
    console.error('❌ VAPID public key is missing. Check frontend .env');
    alert('Push setup failed: VAPID key missing');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log('Notification permission denied');
    return;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
  });

  const token = localStorage.getItem('token');
  await fetch(`${import.meta.env.VITE_API_URL}/api/subscribe`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });

  setIsSubscribed(true);
  console.log('✅ Push notifications enabled!');
};


  // ⭐ NEW: Convert VAPID key format
 const urlBase64ToUint8Array = (base64String) => {
  if (!base64String) {
    throw new Error('VAPID public key is undefined');
  }

  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};


  // ⭐ YOUR EXISTING CODE (unchanged)
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: 1 } 
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'property_submission': return '🏠';
      case 'property_status': return '✅';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="notification-panel p-6 bg-white rounded-xl shadow-lg max-w-md">
      {/* ⭐ NEW: Push button + Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Notifications</h3>
        <button 
          onClick={initPushNotifications}
          disabled={isSubscribed}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:from-green-500 disabled:to-green-600 font-medium shadow-md transition-all"
        >
          {isSubscribed ? '✅ Push Active' : '🔔 Enable Push'}
        </button>
      </div>
      
      {/* ⭐ YOUR EXISTING UI (improved styling) */}
      {loading ? (
        <div className="loading flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="no-notifications text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📭</div>
          <p>No notifications yet</p>
          <p className="text-sm mt-1">Enable push notifications for real-time alerts!</p>
        </div>
      ) : (
        <div className="notifications-list space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item p-4 rounded-xl cursor-pointer transition-all border ${
                notification.is_read 
                  ? 'bg-gray-50 border-gray-200 hover:shadow-md' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg hover:shadow-xl'
              }`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="notification-icon text-2xl flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 mb-1 leading-tight">
                    {notification.message}
                  </p>
                  <span className="notification-date text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                {!notification.is_read && (
                  <div className="unread-indicator w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0 animate-pulse"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
