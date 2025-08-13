'use client';

import { useState, useEffect } from 'react';
import Profile from "@/components/Profile";
import UserDiaryEntries from "@/components/UserDiaryEntries";


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
      <div className="min-h-screen bg-cover bg-center bg-no-repeat relative font-pixel bg-fixed" style={{backgroundImage: "url('/images/CIELO PIXEL ART.png')"}}>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
          </div>
          
          {!isOwnProfile ? (
            <>
              {/* Tab Navigation - Only for viewing other users' profiles */}
              <div className="flex justify-center mb-8">
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-6 py-3 rounded-md font-medium transition ${
                      activeTab === 'profile'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('diary')}
                    className={`px-6 py-3 rounded-md font-medium transition ${
                      activeTab === 'diary'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    📖 Diary
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="w-full">
                {activeTab === 'profile' && (
                  <div className="flex justify-center">
                    <Profile 
                      username={username} 
                      onProfileUpdate={handleProfileUpdate}
                    />
                  </div>
                )}

                {activeTab === 'diary' && (
                  <div className="space-y-8">
                    {/* User Diary Entries View */}
                    <div className="flex justify-center">
                      <UserDiaryEntries username={username} />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Own Profile - Show only profile content */
            <div className="w-full flex justify-center">
              <Profile 
                username={username} 
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
