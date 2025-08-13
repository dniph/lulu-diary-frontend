'use client';

import { useState, useEffect } from 'react';
import DiaryReactions from './DiaryReactions';
import Comments from './Comments';
import { parseISO, format } from 'date-fns';
import { enUS } from 'date-fns/locale';

export default function UserDiaryEntries({ username }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch current user for authentication status
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

  // Fetch diary entries for the profile
  useEffect(() => {
    async function fetchUserEntries() {
      if (!username) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // This endpoint should return public entries or friend-only entries if the viewer is a friend
        const res = await fetch(`/api/lulu-diary/profiles/${username}/diaries`, {
          credentials: 'include'
        });
        
        if (!res.ok) throw new Error("Error loading diary entries");
        
        const data = await res.json();
        const sortedEntries = Array.isArray(data) 
          ? [...data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          : [];
        
        setEntries(sortedEntries);
        
        // Position at the most recent entry
        if (sortedEntries.length > 0) {
          setCurrentIndex(sortedEntries.length - 1);
        } else {
          setCurrentIndex(0);
        }
      } catch (err) {
        setError(err.message);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserEntries();
  }, [username]);

  const handleNext = () => {
    if (currentIndex < entries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const formatDate = (dateString) =>
    format(parseISO(dateString), 'EEEE d MMMM yyyy', { locale: enUS });

  const getVisibilityIcon = (visibility) => {
    switch (visibility) {
      case 'public': return '🌍';
      case 'friends-only': return '👥';
      case 'private': return '🔒';
      default: return '🔒';
    }
  };

  const getVisibilityText = (visibility) => {
    switch (visibility) {
      case 'public': return 'Public';
      case 'friends-only': return 'Friends only';
      case 'private': return 'Private';
      default: return 'Private';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" >
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-pink-400 rounded-lg border-4 border-pink-600 p-6 font-pixel">
          <p className="text-white font-bold">✨ LOADING ENTRIES... ✨</p>
          <p className="text-white text-xs mt-2">User: {username || 'Loading user...'}</p>
        </div>
      </div>
    </div>
  );
  
  if (entries.length === 0) return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" >
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-pink-400 rounded-lg border-4 border-pink-600 p-6 font-pixel">
          <p className="text-white font-bold">📖 NO ENTRIES FOUND 📖</p>
          <p className="text-white text-xs mt-2">This user has no public entries or entries shared with friends.</p>
        </div>
      </div>
    </div>
  );

  const entry = entries[currentIndex];

  return (
    <div>
      <div className="relative z-10 max-w-4xl mx-auto p-4 font-pixel">
        {/* Main kawaii container */}
        <div className="bg-orange-200 rounded-lg border-4 border-pink-500 shadow-2xl relative overflow-hidden">
          {/* Title bar - kawaii style */}
          <div className="bg-pink-500 p-4 border-b-4 border-pink-600 relative">
            <div className="text-center relative z-10">
              <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-2">
                📖 {username}&apos;s DIARY 📖
              </h2>
              <div className="flex justify-center items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-pink-100 text-xs uppercase tracking-wider">FRIEND VIEW MODE</span>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            {/* Decorative corner elements */}
            <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
            <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
            <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
            <div className="absolute bottom-2 right-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
          </div>

          <div className="p-6">
            {/* Entry container - kawaii style */}
            <div className="bg-pink-200 rounded-lg border-4 border-pink-600 shadow-lg relative overflow-hidden">
              {/* Kawaii style border decoration */}
              <div className="absolute inset-0 border-2 border-pink-400 rounded-lg m-1"></div>
              
              {/* Header with date and visibility */}
              <div className="bg-pink-500 p-3 border-b-2 border-pink-600 relative">
                <div className="flex justify-between items-center">
                  <h2 className="text-white font-bold text-sm flex-1 uppercase tracking-wider">
                    📜 {formatDate(entry.createdAt)}
                  </h2>
                  <div className="bg-pink-800 px-2 py-1 rounded border border-pink-900 text-white text-xs">
                    {getVisibilityIcon(entry.visibility)} {getVisibilityText(entry.visibility)}
                  </div>
                </div>
                {/* Decorative pixels */}
                <div className="absolute top-1 left-2 w-1 h-1 bg-yellow-300"></div>
                <div className="absolute top-1 right-2 w-1 h-1 bg-yellow-300"></div>
              </div>

              {/* Content area with kawaii texture effect */}
              <div className="p-4 bg-cyan-300 relative">
                {/* Kawaii style dots pattern */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(219, 39, 119, 0.3) 1px, transparent 0)`,
                  backgroundSize: '8px 8px'
                }}></div>
                
                {/* Title Section */}
                <div className="mb-4 relative z-10">
                  <h1 className="text-lg font-bold flex-1 text-pink-900 uppercase tracking-wide">🌟 {entry.title}</h1>
                </div>

                {/* Content Section */}
                <div className="mb-4 relative z-10">
                  <p className="text-pink-900 flex-1 text-xs leading-relaxed whitespace-pre-line">{entry.content}</p>
                </div>

                {/* Timestamp */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-pink-500 relative z-10">
                  <div className="bg-pink-700 text-white px-2 py-1 rounded text-xs border border-pink-800">
                    {entry.updatedAt && entry.updatedAt !== entry.createdAt
                      ? `📝 EDITED: ${formatDate(entry.updatedAt)}`
                      : `📅 WRITTEN: ${formatDate(entry.createdAt)}`}
                  </div>
                </div>
              </div>
              
              {/* Corner decorations like kawaii UI */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-pink-700 border-r border-b border-pink-800"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-pink-700 border-l border-b border-pink-800"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-700 border-r border-t border-pink-800"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-700 border-l border-t border-pink-800"></div>
            </div>

            {/* Navigation Controls - kawaii style */}
            <div className="flex justify-between mt-6 gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="px-4 py-3 bg-purple-400 hover:bg-purple-500 text-white rounded border-4 border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105"
              >
                ⬅️ PREV
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === entries.length - 1}
                className="px-4 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded border-4 border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105"
              >
                NEXT ➡️
              </button>
            </div>
          </div>
        </div>

        {/* Reactions and Comments Sections - kawaii containers */}
        <div className="mt-6 space-y-4">
          {/* Reactions Section */}
          <div className="bg-purple-200 rounded-lg border-4 border-purple-500 p-4 relative overflow-hidden">
            <div className="bg-purple-400 p-2 border-b-4 border-purple-500 mb-4 relative -mx-4 -mt-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider text-center">
                💖 REACTIONS 💖
              </h3>
              <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-400"></div>
              <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-400"></div>
            </div>
            <DiaryReactions 
              username={username} 
              diaryId={entry.id} 
              currentUser={currentUser}
              currentUserId={currentUser?.id}
            />
          </div>

          {/* Comments Section */}
          <div className="bg-green-200 rounded-lg border-4 border-green-500 p-4 relative overflow-hidden">
            <div className="bg-green-400 p-2 border-b-4 border-green-500 mb-4 relative -mx-4 -mt-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider text-center">
                💬 COMMENTS 💬
              </h3>
              <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-400"></div>
              <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-400"></div>
            </div>
            <Comments 
              username={username} 
              diaryId={entry.id} 
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
