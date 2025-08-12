'use client';

import { useState } from 'react';
import FriendRequests from './FriendRequests';
import FriendsList from './FriendsList';

export default function FriendsSystem({ username, currentUserId = 1, isOwnProfile = false }) {
  const [activeTab, setActiveTab] = useState('friends');

  return (
    <div className="max-w-4xl mx-auto p-4 font-pixel">
      {/* Kawaii/pixel art main container */}
      <div className="bg-cyan-100 rounded-lg border-4 border-blue-500 shadow-2xl relative overflow-hidden">
        {/* Decorative inner border */}
        <div className="absolute inset-0 border-4 border-blue-300 rounded-lg m-2 pointer-events-none"></div>

        {/* Tab Navigation - Kawaii style */}
        <div className="bg-blue-400 p-4 border-b-4 border-blue-500 relative z-10">
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-6 py-2 text-center font-bold uppercase tracking-wider rounded-t-lg border-4 transition-all duration-200 shadow-md text-xs md:text-sm ${
                activeTab === 'friends'
                  ? 'bg-pink-300 border-pink-500 text-pink-900 scale-105'
                  : 'bg-white border-blue-300 text-blue-700 hover:bg-pink-100 hover:border-pink-400 hover:text-pink-700'
              }`}
            >
              <span className="text-lg mr-1">👥</span> Amigos
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-6 py-2 text-center font-bold uppercase tracking-wider rounded-t-lg border-4 transition-all duration-200 shadow-md text-xs md:text-sm ${
                  activeTab === 'requests'
                    ? 'bg-yellow-200 border-yellow-500 text-yellow-900 scale-105'
                    : 'bg-white border-blue-300 text-blue-700 hover:bg-yellow-100 hover:border-yellow-400 hover:text-yellow-700'
                }`}
              >
                <span className="text-lg mr-1">📮</span> Solicitudes
              </button>
            )}
          </div>
          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-pink-200 border border-pink-400"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-pink-200 border border-pink-400"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-pink-200 border border-pink-400"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-pink-200 border border-pink-400"></div>
        </div>

        {/* Tab Content - Kawaii style container */}
        <div className="p-6 bg-white/80 rounded-b-lg min-h-[400px] relative z-10">
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

        {/* Kawaii-style corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500 border-r-4 border-b-4 border-blue-900"></div>
        <div className="absolute top-0 right-0 w-4 h-4 bg-blue-500 border-l-4 border-b-4 border-blue-900"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 bg-blue-500 border-r-4 border-t-4 border-blue-900"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 border-l-4 border-t-4 border-blue-900"></div>
      </div>
    </div>
  );
}