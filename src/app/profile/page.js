
'use client';

import { useState } from 'react';
import DayView from '@/components/DayView';
import DiaryEntry from "@/components/DiaryEntry";
import Profile from "@/components/Profile";

export default function ProfilePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState('diary');

  const handleNewEntry = () => {
    // Trigger refresh in DayView when a new entry is created
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProfileUpdate = (updatedProfile) => {
    console.log('Profile updated:', updatedProfile);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Mi Espacio Personal</h1>
        
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
              📖 Mi Diario
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-md font-medium transition ${
                activeTab === 'profile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              👤 Mi Perfil
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
              
              {/* New Entry Form */}
              <div className="flex justify-center">
                <DiaryEntry onEntryCreated={handleNewEntry} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="flex justify-center">
              <Profile username="dniph" onProfileUpdate={handleProfileUpdate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
