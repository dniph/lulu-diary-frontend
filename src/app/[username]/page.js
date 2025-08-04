'use client';

import { useState, useEffect } from 'react';
import DayView from '@/components/DayView';
import DiaryEntry from "@/components/DiaryEntry";
import Profile from "@/components/Profile";

export default function UserProfilePage({ params }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('diary');
  const [username, setUsername] = useState('');

  useEffect(() => {
    async function getUsername() {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    }
    getUsername();
  }, [params]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          @{username}
        </h1>
        <p className="text-center text-gray-600 mb-8">Espacio Personal</p>
        
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
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'diary' && (
            <div className="space-y-8">
              {/* Diary View */}
              <div className="flex justify-center">
                <DayView refreshTrigger={refreshTrigger} username={username} />
              </div>
              
              {/* New Entry Form - TODO: Only show for authenticated user's own profile */}
              <div className="flex justify-center">
                <DiaryEntry onEntryCreated={handleNewEntry} username={username} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex justify-center">
              <Profile 
                username={username} 
                onProfileUpdate={handleProfileUpdate} 
                currentUserId={1} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
