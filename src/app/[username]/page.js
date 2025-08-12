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
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function getUsername() {
      const resolvedParams = await params;
      setUsername(resolvedParams.username);
    }
    getUsername();
  }, [params]);

  // Get current authenticated user
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch('/api/lulu-diary/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    }

    fetchCurrentUser();
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
  const isOwnProfile = currentUser && username === currentUser.username;

  return (
    <div className="min-h-screen relative overflow-hidden font-kawaii">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/ChatGPT.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">
              @{username}
            </h1>
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
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'diary' && (
              <div className="space-y-8">
                {/* Diary View */}
                <div className="flex justify-center">
                  <DayView refreshTrigger={refreshTrigger} />
                </div>
                
                {/* New Entry Form - Only show for authenticated user's own profile */}
                {isOwnProfile && (
                  <div className="flex justify-center">
                    <DiaryEntry onEntryCreated={handleNewEntry} />
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="flex justify-center">
                <Profile 
                  username={username} 
                  onProfileUpdate={handleProfileUpdate}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
