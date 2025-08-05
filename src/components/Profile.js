'use client';

import { useState, useEffect } from 'react';
import FollowSystem from './FollowSystem';

export default function Profile({ username = 'dniph', onProfileUpdate, currentUserId = 1 }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:5180/api/profiles/${username}`);
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

    fetchProfile();
  }, [username]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`http://localhost:5180/api/profiles/${username}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Error al actualizar el perfil');

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
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

  if (loading) return <p className="text-center">Cargando perfil...</p>;
  if (!profile) return <p className="text-center text-red-500">No se pudo cargar el perfil</p>;

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUserId && (profile.id === currentUserId || profile.username === 'dniph'); // Assuming 'dniph' is currentUserId=1

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4 font-kawaii">
      {/* Kawaii Header Border */}
      <div className="w-full h-8 bg-gradient-to-r from-pink-200 via-blue-200 to-pink-200 rounded-full relative overflow-hidden animate-float">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-4 text-pink-400">
            {[...Array(8)].map((_, i) => (
              <span key={i} className="text-xl animate-sparkle" style={{animationDelay: `${i * 0.2}s`}}>
                {['🐾', '⭐', '💕', '✨'][i % 4]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-3xl shadow-kawaii border-4 border-pink-200 relative overflow-hidden">
        {/* Kawaii Background Decorations */}
        <div className="absolute top-4 left-4 text-pink-300 text-2xl animate-float">⭐</div>
        <div className="absolute top-6 right-6 text-purple-300 text-xl animate-sparkle">💫</div>
        <div className="absolute bottom-6 left-8 text-pink-300 text-lg animate-float" style={{animationDelay: '0.5s'}}>🌸</div>
        <div className="absolute bottom-4 right-4 text-blue-300 text-xl animate-sparkle" style={{animationDelay: '1s'}}>✨</div>
        
        {/* Profile Title - Kawaii Style */}
        <div className="text-center mb-8 relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 font-kawaii animate-rainbow">
            ✨ Profile ✨
          </h1>
          <div className="flex justify-center items-center gap-2 mb-6">
            <span className="text-pink-400 animate-sparkle">🌸</span>
            <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border-2 border-pink-200 font-medium shadow-kawaii">
              KAWAII DIARY
            </span>
            <span className="text-pink-400 animate-sparkle" style={{animationDelay: '0.5s'}}>🌸</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-32 h-32 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-bold shadow-kawaii border-4 border-white relative animate-float">
              {profile.name ? profile.name.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
              {/* Kawaii sparkles around avatar */}
              <div className="absolute -top-2 -right-2 text-yellow-400 text-lg animate-sparkle">✨</div>
              <div className="absolute -bottom-1 -left-2 text-pink-400 text-sm animate-float">💕</div>
            </div>
            {/* Username with kawaii styling */}
            <div className="mt-4 bg-white rounded-full px-6 py-2 border-3 border-pink-200 shadow-kawaii inline-block">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-kawaii">
                @{profile.username}
              </h2>
            </div>
          </div>
        </div>

      {editing ? (
        <div className="bg-white rounded-3xl p-6 border-4 border-pink-200 shadow-lg relative">
          {/* Edit Mode Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              ✏️ Edit Your Kawaii Profile ✏️
            </h3>
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-pink-400">🌟</span>
              <span className="text-purple-400">💖</span>
              <span className="text-blue-400">✨</span>
            </div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-lg font-bold text-pink-600 mb-2 flex items-center gap-2">
              <span>🌸</span> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-4 border-3 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-300 focus:border-pink-400 bg-pink-50 text-gray-700 font-medium placeholder-pink-300 transition-all"
              placeholder="Your kawaii name ✨"
            />
            <div className="absolute top-2 right-4 text-pink-300 text-xl">💕</div>
          </div>

          <div className="relative">
            <label className="block text-lg font-bold text-purple-600 mb-2 flex items-center gap-2">
              <span>💌</span> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-4 border-3 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-400 bg-purple-50 text-gray-700 font-medium placeholder-purple-300 transition-all"
              placeholder="your@kawaii.email 📧"
            />
            <div className="absolute top-2 right-4 text-purple-300 text-xl">✨</div>
          </div>

          <div className="relative">
            <label className="block text-lg font-bold text-blue-600 mb-2 flex items-center gap-2">
              <span>📝</span> Biography
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="5"
              className="w-full p-4 border-3 border-blue-200 rounded-2xl focus:ring-4 focus:ring-blue-300 focus:border-blue-400 bg-blue-50 text-gray-700 font-medium placeholder-blue-300 resize-none transition-all"
              placeholder="Tell us about your kawaii journey! 🌟✨💖"
            />
            <div className="absolute top-2 right-4 text-blue-300 text-xl">🌸</div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-6 rounded-2xl hover:from-pink-500 hover:to-pink-600 transition-all font-bold text-lg shadow-lg transform hover:scale-105 border-2 border-pink-300"
            >
              💾 Save Changes ✨
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 px-6 rounded-2xl hover:from-gray-500 hover:to-gray-600 transition-all font-bold text-lg shadow-lg transform hover:scale-105 border-2 border-gray-300"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Info Card - Kawaii Style */}
          <div className="bg-white rounded-3xl p-6 border-4 border-pink-200 shadow-xl relative overflow-hidden">
            {/* Kawaii decorations */}
            <div className="absolute top-2 left-2 text-pink-300 text-lg animate-pulse">🌸</div>
            <div className="absolute top-2 right-2 text-purple-300 text-lg animate-bounce">✨</div>
            
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent flex items-center justify-center gap-2">
                <span>💕</span> Personal Info <span>💕</span>
              </h3>
              <div className="flex justify-center gap-1 mt-2">
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-4 rounded-2xl border-2 border-pink-200 relative">
                <div className="absolute top-2 right-2 text-pink-400">🌸</div>
                <span className="text-lg font-bold text-pink-600 flex items-center gap-2 mb-2">
                  <span>👤</span> Name:
                </span>
                <p className="text-gray-800 font-medium text-lg pl-6">{profile.name || '✨ Not specified yet ✨'}</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl border-2 border-purple-200 relative">
                <div className="absolute top-2 right-2 text-purple-400">💌</div>
                <span className="text-lg font-bold text-purple-600 flex items-center gap-2 mb-2">
                  <span>📧</span> Email:
                </span>
                <p className="text-gray-800 font-medium text-lg pl-6">{profile.email || '✨ Not specified yet ✨'}</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl border-2 border-blue-200 relative">
                <div className="absolute top-2 right-2 text-blue-400">📝</div>
                <span className="text-lg font-bold text-blue-600 flex items-center gap-2 mb-2">
                  <span>💭</span> Biography:
                </span>
                <p className="text-gray-800 font-medium text-lg pl-6 leading-relaxed">
                  {profile.bio || '✨ No kawaii story yet... Write something cute! ✨'}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl border-2 border-green-200 relative">
                <div className="absolute top-2 right-2 text-green-400">🗓️</div>
                <span className="text-lg font-bold text-green-600 flex items-center gap-2 mb-2">
                  <span>🌟</span> Member since:
                </span>
                <p className="text-gray-800 font-medium text-lg pl-6">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : '✨ Date not available ✨'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button - Kawaii Style */}
          <button
            onClick={() => setEditing(true)}
            className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white py-4 px-8 rounded-3xl hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 transition-all font-bold text-xl shadow-xl transform hover:scale-105 border-2 border-white relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              <span>✏️</span> Edit Kawaii Profile <span>✨</span>
            </span>
            {/* Animated background sparkles */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-2 left-4 text-white text-xl animate-pulse">⭐</div>
              <div className="absolute bottom-2 right-4 text-white text-xl animate-bounce">💫</div>
              <div className="absolute top-1/2 left-1/4 text-white text-sm animate-pulse" style={{animationDelay: '0.5s'}}>✨</div>
              <div className="absolute top-1/4 right-1/4 text-white text-sm animate-bounce" style={{animationDelay: '1s'}}>🌸</div>
            </div>
          </button>
        </div>
      )}
      </div>

      {/* Kawaii Bottom Border */}
      <div className="w-full h-6 bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-6 text-pink-400 opacity-60">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-lg animate-pulse" style={{animationDelay: `${i * 0.3}s`}}>
                {['💕', '🌸', '⭐', '✨', '💫', '🌟'][i]}
              </span>
            ))}
          </div>
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
