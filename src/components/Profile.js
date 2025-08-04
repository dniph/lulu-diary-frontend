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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          {profile.name ? profile.name.charAt(0).toUpperCase() : profile.username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">@{profile.username}</h2>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biografía
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Cuéntanos un poco sobre ti..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Información Personal</h3>
            
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Nombre:</span>
                <p className="text-gray-800">{profile.name || 'No especificado'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <p className="text-gray-800">{profile.email || 'No especificado'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Biografía:</span>
                <p className="text-gray-800">{profile.bio || 'No hay biografía disponible'}</p>
              </div>
              
              <div>
                <span className="text-sm font-medium text-gray-600">Miembro desde:</span>
                <p className="text-gray-800">
                  {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Fecha no disponible'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Editar Perfil
          </button>
        </div>
      )}
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
