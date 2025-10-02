import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { Notification } from '../../../types/admin';

interface CommunicationCenterProps {
  className?: string;
}

export function CommunicationCenter({ className = '' }: CommunicationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'notifications' | 'announcements' | 'messages'>('notifications');
  const [newAnnouncement, setNewAnnouncement] = useState('');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const sendAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    
    try {
      await api.sendAnnouncement({
        message: newAnnouncement,
        priority: 'high',
        targetAudience: 'all'
      });
      setNewAnnouncement('');
      await loadNotifications();
    } catch (err) {
      console.error('Error sending announcement:', err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={loadNotifications}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Communication & Notification Center</h2>
        <p className="text-gray-600">Manage system communications, announcements, and notifications</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'notifications', label: 'Notifications', count: notifications.filter(n => !n.read).length },
            { key: 'announcements', label: 'Announcements', count: 0 },
            { key: 'messages', label: 'System Messages', count: 0 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Notifications Tab */}
      {selectedTab === 'notifications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Recent Notifications</h3>
            <button 
              onClick={loadNotifications}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
          
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No notifications to display</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                  } hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`font-medium ${
                          notification.read ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          getPriorityColor(notification.priority)
                        } bg-opacity-10`}>
                          {notification.priority}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        notification.read ? 'text-gray-500' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {selectedTab === 'announcements' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Send System Announcement</h3>
            <div className="bg-white border rounded-lg p-4">
              <textarea
                value={newAnnouncement}
                onChange={(e) => setNewAnnouncement(e.target.value)}
                placeholder="Enter your announcement message..."
                className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-3 flex justify-between items-center">
                <div className="flex space-x-2">
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                    <option value="all">All Users</option>
                    <option value="admins">Admins Only</option>
                    <option value="managers">Managers</option>
                    <option value="staff">Staff</option>
                  </select>
                  <select className="px-3 py-1 border border-gray-300 rounded text-sm">
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                <button
                  onClick={sendAnnouncement}
                  disabled={!newAnnouncement.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send Announcement
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
            <div className="bg-gray-50 border rounded-lg p-8 text-center text-gray-500">
              <p>No recent announcements</p>
              <p className="text-sm mt-1">System announcements will appear here</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {selectedTab === 'messages' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">System Messages</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Welcome Messages', count: 12, type: 'welcome' },
                { title: 'Error Notifications', count: 3, type: 'error' },
                { title: 'Success Messages', count: 8, type: 'success' },
                { title: 'Warning Alerts', count: 2, type: 'warning' },
                { title: 'Info Messages', count: 15, type: 'info' },
                { title: 'System Updates', count: 5, type: 'update' }
              ].map((messageType) => (
                <div key={messageType.type} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900 mb-2">{messageType.title}</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{messageType.count}</p>
                  <p className="text-sm text-gray-500">Active messages</p>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                    Manage →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}