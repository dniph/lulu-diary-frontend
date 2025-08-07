'use client';

import { useState, useEffect } from 'react';
import DayView from '@/components/DayView';
import DiaryEntry from "@/components/DiaryEntry";
import Profile from "@/components/Profile";
import FriendsSystem from "@/components/FriendsSystem";

export default function UserProfilePage({ params }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('diary');
  const [username, setUsername] = useState('');
  const [currentUser, setCurrentUser] = useState('dniph'); // Simulate current logged user

  useEffect(() => {
    async function getUsername() {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    }
    getUsername();
  }, [params]);

  // Simulate getting current user from auth context (in real app this would come from authentication)
  useEffect(() => {
    // For demo purposes, let's allow switching between users
    // In real app, this would come from your authentication system
    const urlParams = new URLSearchParams(window.location.search);
    const currentUserParam = urlParams.get('as') || 'dniph';
    setCurrentUser(currentUserParam);
  }, []);

  const handleNewEntry = () => {
    // Trigger refresh in DayView when a new entry is created
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProfileUpdate = (updatedProfile) => {
    console.log('Profile updated:', updatedProfile);
  };

  // Show loading state while username is being resolved
  if (!username) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  // Check if current user is viewing their own profile
  const isOwnProfile = username === currentUser;
  
  // Get currentUserId based on username (for demo purposes)
  const getCurrentUserId = (user) => {
    switch(user) {
      case 'dniph': return 1;
      case 'Varto': return 2;
      default: return 1;
    }
  };
  
  const currentUserId = getCurrentUserId(currentUser);

  return (
    <div className="min-h-screen relative overflow-hidden font-kawaii">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/ChatGPT.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800">
            @{username}
          </h1>
          
          {/* User switcher for demo purposes */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Viendo como:</span>
            <select 
              value={currentUser} 
              onChange={(e) => setCurrentUser(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="dniph">@dniph</option>
              <option value="Varto">@Varto</option>
            </select>
          </div>
        </div>
        <p className="text-center text-gray-600 mb-8">
          {isOwnProfile ? 'Tu Espacio Personal' : `Perfil de @${username}`}
        </p>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-2 rounded-lg shadow-md">
            <button
              onClick={() => setActiveTab('diary')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'diary'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              📖 Diario
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              👤 Perfil
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'friends'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              👥 Amigos
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'diary' && (
            <div className="space-y-8">
              {/* Diary View */}
              <div className="flex justify-center">
                <DayView refreshTrigger={refreshTrigger} username={username} currentUserId={currentUserId} />
              </div>
              
              {/* New Entry Form - Only show for authenticated user's own profile */}
              {isOwnProfile && (
                <div className="flex justify-center">
                  <DiaryEntry onEntryCreated={handleNewEntry} username={username} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex justify-center">
              <Profile 
                username={username} 
                onProfileUpdate={handleProfileUpdate} 
                currentUserId={currentUserId} 
              />
            </div>
          )}

          {activeTab === 'friends' && (
            <div className="flex justify-center">
              <FriendsSystem 
                username={username} 
                currentUserId={currentUserId} 
                isOwnProfile={isOwnProfile} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
