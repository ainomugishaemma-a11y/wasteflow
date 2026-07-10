import React, { useEffect, useState } from 'react';
import { Notification } from '@/types';
import { useNotifications } from '@/context/NotificationContext';
import { CheckCircle, AlertCircle, Trash2, Bell } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { notifications, markAsRead, deleteNotification, isLoading } = useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'full':
        return <AlertCircle className="text-red-600" />;
      case 'nearly_full':
        return <AlertCircle className="text-yellow-600" />;
      case 'not_emptied':
        return <Bell className="text-orange-600" />;
      default:
        return <CheckCircle className="text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'full':
        return 'border-l-4 border-red-500';
      case 'nearly_full':
        return 'border-l-4 border-yellow-500';
      case 'not_emptied':
        return 'border-l-4 border-orange-500';
      default:
        return 'border-l-4 border-blue-500';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card animate-pulse h-20"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.length > 0 ? (
        notifications.map(notif => (
          <div
            key={notif.id}
            className={`card p-4 ${getNotificationColor(notif.notification_type)} ${
              !notif.read_status ? 'bg-blue-50' : 'bg-white'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="mt-1">
                  {getNotificationIcon(notif.notification_type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{notif.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {!notif.read_status && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition"
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="card text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No notifications</p>
        </div>
      )}
    </div>
  );
};
