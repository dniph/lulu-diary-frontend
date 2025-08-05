'use client';

import { useState } from 'react';
import FriendRequests from './FriendRequests';
import FriendsList from './FriendsList';

export default function FriendsSystem({ username, currentUserId = 1, isOwnProfile = false }) {
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
              activeTab === 'friends'
                ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">👥</span>
              <span>Amigos</span>
            </div>
          </button>
          
          {/* Only show friend requests tab for own profile */}
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('requests')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'requests'
                  ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">📮</span>
                <span>Solicitudes</span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {activeTab === 'friends' && (
          <FriendsList 
            username={username}
            currentUserId={currentUserId}
            isOwnProfile={isOwnProfile}
          />
        )}

        {activeTab === 'requests' && isOwnProfile && (
          <FriendRequests 
            currentUserId={currentUserId}
          />
        )}
      </div>
    </div>
  );
}