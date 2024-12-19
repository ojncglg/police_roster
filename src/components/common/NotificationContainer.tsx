import { useEffect, useState } from 'react';
import { notificationService } from '../../services/notificationService';
import type { Notification } from '../../services/notificationService';

const NotificationContainer = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribe(setNotifications);
    return () => unsubscribe();
  }, []);

  const getNotificationStyles = (type: Notification['type']) => {
    const baseStyles = 'rounded-lg p-4 mb-4 flex items-center justify-between shadow-lg transition-all duration-500 ease-in-out';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border-l-4 border-green-500`;
      case 'error':
        return `${baseStyles} bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border-l-4 border-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border-l-4 border-yellow-500`;
      case 'info':
        return `${baseStyles} bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-l-4 border-blue-500`;
      default:
        return baseStyles;
    }
  };

  const getIcon = (type: Notification['type']) => {
    const iconClasses = "w-5 h-5 mr-3";
    
    switch (type) {
      case 'success':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-4">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            ${getNotificationStyles(notification.type)}
            transform translate-x-0 opacity-100
            animate-[slideIn_0.5s_ease-out]
            backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95
          `}
          role="alert"
        >
          <div className="flex items-center">
            {getIcon(notification.type)}
            <div className="flex-1 mr-2">
              <p className="text-sm font-medium">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => notificationService.remove(notification.id)}
              className="text-current opacity-50 hover:opacity-75 transition-opacity duration-150"
              aria-label="Close notification"
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
