'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import FollowSystem from './FollowSystem';

export default function Profile({ username = null, onProfileUpdate, currentUserId = null, useMe = false }) {
  const [profile, setProfile] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  // Fetch current user profile using Me API
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const res = await fetch(`/api/lulu-diary/me`);
        if (res.ok) {
          const currentUser = await res.json();
          setCurrentUserProfile(currentUser);
          
          // If we're using Me API or viewing own profile, use this data
          if (useMe || !username || username === currentUser.username) {
            setProfile(currentUser);
            setFormData({
              name: currentUser.name || '',
              email: currentUser.email || '',
              bio: currentUser.bio || '',
            });
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
      
      // If not using Me API and viewing different user, fetch specific profile
      if (username && !useMe) {
        await fetchSpecificProfile();
      } else {
        setLoading(false);
      }
    }

    async function fetchSpecificProfile() {
      try {
        const res = await fetch(`/api/lulu-diary/profiles/${username}`);
        if (!res.ok) throw new Error('Error al obtener el perfil');
        const data = await res.json();
        setProfile(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          bio: data.bio || '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCurrentUser();
  }, [username, useMe]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let res;
      const isOwnProfile = currentUserProfile && (
        useMe || 
        !username || 
        username === currentUserProfile.username ||
        profile?.id === currentUserProfile.id
      );

      if (isOwnProfile) {
        // Use Me API for current user's profile
        res = await fetch(`/api/lulu-diary/me`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Use specific profile endpoint for other users
        res = await fetch(`/api/lulu-diary/profiles/${username}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }

      if (!res.ok) throw new Error('Error al actualizar el perfil');

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      
      // Update current user profile if this was their own profile
      if (isOwnProfile) {
        setCurrentUserProfile(updatedProfile);
      }
      
      setEditing(false);
      
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil.');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      bio: profile.bio || '',
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: "url('/images/ATARDECER.jpg')"}}>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-pink-400 rounded-lg border-4 border-pink-600 p-6 font-pixel">
          <p className="text-white font-bold">✨ LOADING PROFILE... ✨</p>
        </div>
      </div>
    </div>
  );
  
  if (!profile) return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" style={{backgroundImage: "url('/images/ATARDECER.jpg')"}}>
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-red-400 rounded-lg border-4 border-red-600 p-6 font-pixel">
          <p className="text-white font-bold">❌ PROFILE NOT FOUND ❌</p>
        </div>
      </div>
    </div>
  );

  // Check if current user is viewing their own profile (no more hardcoded values)
  const isOwnProfile = currentUserProfile && (
    useMe || 
    !username || 
    username === currentUserProfile.username ||
    profile?.id === currentUserProfile.id
  );

  return (
    <div className="max-w-4xl mx-auto p-4 font-pixel">
      {/* Main kawaii container */}
      <div className="bg-cyan-200 rounded-lg border-4 border-purple-500 shadow-2xl relative overflow-hidden">
        {/* Title bar - kawaii style */}
        <div className="bg-purple-500 p-4 border-b-4 border-purple-600 relative">
          <div className="text-center relative z-10">
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-2">
              � PROFILE VIEWER �
            </h2>
            <div className="flex justify-center items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-purple-100 text-xs uppercase tracking-wider">KAWAII MODE</span>
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
          {/* Profile Avatar Section - kawaii style */}
          <div className="bg-pink-200 rounded-lg border-4 border-pink-600 shadow-lg relative overflow-hidden mb-6">
            {/* Kawaii style border decoration */}
            <div className="absolute inset-0 border-2 border-pink-400 rounded-lg m-1"></div>
            
            {/* Header with kawaii-style title bar */}
            <div className="bg-pink-500 p-3 border-b-2 border-pink-600 relative">
              <div className="text-center">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                  🌟 USER INFO 🌟
                </h3>
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
              
              {/* Avatar and Username */}
              <div className="text-center relative z-10">
                <div className="inline-block mb-4">
                  <div className="w-24 h-24 rounded border-4 border-pink-900 mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg relative overflow-hidden">
                    {profile.username === currentUserProfile?.username && profile.profilePicture ? (
                      <Image 
                        src={profile.profilePicture} 
                        alt="Profile Picture" 
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : profile.username === 'dniph' ? (
                      <Image 
                        src="/images/profile-picture.jpg" 
                        alt="Profile Picture" 
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-400 flex items-center justify-center">
                        {profile.name ? profile.name.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Kawaii sparkles around avatar */}
                    <div className="absolute -top-1 -right-1 text-yellow-300 text-sm">✨</div>
                    <div className="absolute -bottom-1 -left-1 text-pink-300 text-xs">💕</div>
                  </div>
                </div>
                
                {/* Username with kawaii styling */}
                <div className="bg-pink-700 text-white px-4 py-2 rounded border-2 border-pink-800 inline-block">
                  <h2 className="text-lg font-bold uppercase tracking-wide">
                    @{profile.username}
                  </h2>
                </div>
              </div>
              
              {/* Corner decorations like kawaii UI */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-pink-700 border-r border-b border-pink-800"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-pink-700 border-l border-b border-pink-800"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-700 border-r border-t border-pink-800"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-700 border-l border-t border-pink-800"></div>
            </div>
          </div>

      {editing ? (
        <div className="bg-orange-100 rounded-lg border-4 border-orange-500 p-6 relative overflow-hidden">
          {/* Edit Mode Header */}
          <div className="bg-orange-400 p-3 border-b-4 border-orange-500 mb-6 relative -mx-6 -mt-6">
            <h3 className="text-white text-lg font-bold uppercase tracking-wider text-center">
              ✏️ EDIT INTERFACE ✏️
            </h3>
            {/* Decorative elements */}
            <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-400"></div>
            <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-400"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input - Kawaii Style */}
            <div className="relative">
              <label className="block text-orange-700 text-sm font-bold mb-2 uppercase tracking-wide">
                � NAME
              </label>
              <div className="bg-orange-50 border-4 border-orange-400 rounded p-1">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-orange-300 rounded text-orange-800 font-pixel text-xs placeholder-orange-400 focus:border-orange-500 focus:outline-none"
                  placeholder="Your kawaii name..."
                />
              </div>
            </div>

            {/* Email Input - Kawaii Style */}
            <div className="relative">
              <label className="block text-orange-700 text-sm font-bold mb-2 uppercase tracking-wide">
                � EMAIL
              </label>
              <div className="bg-orange-50 border-4 border-orange-400 rounded p-1">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border-2 border-orange-300 rounded text-orange-800 font-pixel text-xs placeholder-orange-400 focus:border-orange-500 focus:outline-none"
                  placeholder="your@kawaii.email..."
                />
              </div>
            </div>

            {/* Bio Textarea - Kawaii Style */}
            <div className="relative">
              <label className="block text-orange-700 text-sm font-bold mb-2 uppercase tracking-wide">
                📝 BIO
              </label>
              <div className="bg-orange-50 border-4 border-orange-400 rounded p-1">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-3 bg-white border-2 border-orange-300 rounded text-orange-800 font-pixel text-xs placeholder-orange-400 resize-none focus:border-orange-500 focus:outline-none"
                  placeholder="Tell your kawaii story..."
                />
              </div>
            </div>

            {/* Submit Buttons - Kawaii Style */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-green-400 text-white py-4 px-6 rounded border-4 border-green-600 hover:bg-green-300 transition-all font-bold text-sm uppercase tracking-wider shadow-lg transform hover:scale-105 relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>💾</span> SAVE <span>✨</span>
                </div>
                {/* Button corners */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-green-200"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-green-200"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-200"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-200"></div>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-gray-400 text-white py-4 px-6 rounded border-4 border-gray-600 hover:bg-gray-300 transition-all font-bold text-sm uppercase tracking-wider shadow-lg transform hover:scale-105 relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <span>❌</span> CANCEL <span>📖</span>
                </div>
                {/* Button corners */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-gray-200"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-gray-200"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-gray-200"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-gray-200"></div>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Profile Info - Kawaii Style */}
          <div className="bg-green-200 rounded-lg border-4 border-green-500 p-4 relative overflow-hidden">
            <div className="bg-green-400 p-2 border-b-4 border-green-500 mb-4 relative -mx-4 -mt-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider text-center">
                💕 PERSONAL INFO 💕
              </h3>
              <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-400"></div>
              <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-400"></div>
            </div>
            
            <div className="space-y-4 text-xs">
              {/* Name */}
              <div className="bg-cyan-100 p-3 rounded border-2 border-green-600 relative">
                <div className="absolute top-1 right-1 text-green-500">🌸</div>
                <span className="font-bold text-green-700 uppercase tracking-wide block mb-1">
                  👤 NAME:
                </span>
                <p className="text-green-800 font-pixel pl-4">
                  {profile.name || '✨ NOT SPECIFIED YET ✨'}
                </p>
              </div>
              
              {/* Email */}
              <div className="bg-cyan-100 p-3 rounded border-2 border-green-600 relative">
                <div className="absolute top-1 right-1 text-green-500">�</div>
                <span className="font-bold text-green-700 uppercase tracking-wide block mb-1">
                  � EMAIL:
                </span>
                <p className="text-green-800 font-pixel pl-4">
                  {profile.email || '✨ NOT SPECIFIED YET ✨'}
                </p>
              </div>
              
              {/* Bio */}
              <div className="bg-cyan-100 p-3 rounded border-2 border-green-600 relative">
                <div className="absolute top-1 right-1 text-green-500">📝</div>
                <span className="font-bold text-green-700 uppercase tracking-wide block mb-1">
                  💭 BIO:
                </span>
                <p className="text-green-800 font-pixel pl-4 leading-relaxed">
                  {profile.bio || '✨ NO KAWAII STORY YET... WRITE SOMETHING CUTE! ✨'}
                </p>
              </div>
              
              {/* Created At */}
              <div className="bg-cyan-100 p-3 rounded border-2 border-green-600 relative">
                <div className="absolute top-1 right-1 text-green-500">🗓️</div>
                <span className="font-bold text-green-700 uppercase tracking-wide block mb-1">
                  🌟 MEMBER SINCE:
                </span>
                <p className="text-green-800 font-pixel pl-4">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '✨ DATE NOT AVAILABLE ✨'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button - Kawaii Style */}
          {isOwnProfile && (
            <button
              onClick={() => setEditing(true)}
              className="w-full bg-blue-400 text-white py-4 px-6 rounded border-4 border-blue-600 hover:bg-blue-300 transition-all font-bold text-sm uppercase tracking-wider shadow-lg transform hover:scale-105 relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span>✏️</span> EDIT KAWAII PROFILE <span>✨</span>
              </div>
              {/* Button corners */}
              <div className="absolute top-0 left-0 w-2 h-2 bg-blue-200"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-blue-200"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-200"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-200"></div>
            </button>
          )}
        </div>
      )}
        </div>
      </div>

      {/* Follow System Component */}
      <FollowSystem 
        username={profile.username} 
        currentUserId={currentUserId} 
        isOwnProfile={isOwnProfile} 
      />
    </div>
  );
}
