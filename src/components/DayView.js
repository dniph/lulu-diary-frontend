'use client';

import { useState, useEffect } from 'react';
import { parseISO, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Comments from './Comments';
import DiaryReactions from './DiaryReactions';

export default function DayView({ refreshTrigger = 0 }) {
  const [entries, setEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

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

  useEffect(() => {
    if (!currentUser) return;
    
    async function fetchEntries() {
      try {
        const res = await fetch(`/api/lulu-diary/profiles/${currentUser.username}/diaries`);
        if (!res.ok) throw new Error('Error al obtener las entradas');
        const data = await res.json();

        // Ordenar por fecha ascendente (más antigua primero)
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setEntries(data);

        // Posicionar en la última entrada (la más reciente)
        if (data.length > 0) {
          setCurrentIndex(data.length - 1);
        } else {
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, [refreshTrigger, currentUser]);

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

const handleDelete = async () => {
    // Solo permitir eliminación si es el propio perfil del usuario
    if (!currentUser) return;
    
    const entryToDelete = entries[currentIndex];
    if (!entryToDelete) return;

    const confirmDelete = window.confirm(`¿Eliminar la entrada "${entryToDelete.title}"?`);
    if (!confirmDelete) return;

    try {
      // Get the authentication token from cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };

      const headers = {};
      
      // Add authorization header if token exists
      const token = getCookie('better-auth.session_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/lulu-diary/profiles/${currentUser.username}/diaries/${entryToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers
      });

      if (!res.ok) throw new Error('Error al eliminar la entrada');

      // Actualizar estado eliminando la entrada
      const newEntries = entries.filter(e => e.id !== entryToDelete.id);
      setEntries(newEntries);

      // Ajustar currentIndex si es necesario
      if (currentIndex >= newEntries.length) {
        setCurrentIndex(newEntries.length - 1 >= 0 ? newEntries.length - 1 : 0);
      }
    } catch (error) {
      console.error('Error eliminando entrada:', error);
      alert('Error al eliminar la entrada.');
    }
  };

  const handleEditTitle = () => {
    // Solo permitir edición si es el propio perfil del usuario
    if (!currentUser) return;
    
    const entry = entries[currentIndex];
    setEditTitle(entry.title);
    setEditingTitle(true);
  };

  const handleEditContent = () => {
    // Solo permitir edición si es el propio perfil del usuario
    if (!currentUser) return;
    
    const entry = entries[currentIndex];
    setEditContent(entry.content);
    setEditingContent(true);
  };

  const saveChanges = async () => {
    const entry = entries[currentIndex];
    try {
      // Get the authentication token from cookies
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
      };

      const headers = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token exists
      const token = getCookie('better-auth.session_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/lulu-diary/profiles/${currentUser.username}/diaries/${entry.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers,
        body: JSON.stringify({
          ...entry,
          title: editTitle || entry.title,
          content: editContent || entry.content,
        }),
      });

      if (!res.ok) throw new Error('Error al actualizar el diario');

      // Usar la respuesta del servidor para actualizar el estado local
      const updatedEntry = await res.json();
      const updatedEntries = [...entries];
      updatedEntries[currentIndex] = updatedEntry;
      setEntries(updatedEntries);
      setEditingTitle(false);
      setEditingContent(false);
    } catch (error) {
      console.error('Error actualizando diario:', error);
      alert('Error al actualizar el diario.');
    }
  };

  const cancelEdit = () => {
    setEditingTitle(false);
    setEditingContent(false);
    setEditTitle('');
    setEditContent('');
  };

  const formatDate = (dateString) =>
    format(parseISO(dateString), 'EEEE d MMMM yyyy', { locale: es });

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
      case 'public': return 'Público';
      case 'friends-only': return 'Solo amigos';
      case 'private': return 'Privado';
      default: return 'Privado';
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" >
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-pink-400 rounded-lg border-4 border-pink-600 p-6 font-pixel">
          <p className="text-white font-bold">✨ LOADING ENTRIES... ✨</p>
          <p className="text-white text-xs mt-2">User: {currentUser?.username || 'Loading user...'}</p>
        </div>
      </div>
    </div>
  );
  
  if (entries.length === 0) return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative" >
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="bg-pink-400 rounded-lg border-4 border-pink-600 p-6 font-pixel">
          <p className="text-white font-bold">📖 NO ENTRIES FOUND 📖</p>
        </div>
      </div>
    </div>
  );
  
  const entry = entries[currentIndex];
  const isLastEntry = currentIndex === entries.length - 1;
  console.log('Mostrando entrada del:', entry.createdAt);
  console.log("Índice actual:", currentIndex);
  console.log("Fecha actual:", entries[currentIndex]?.createdAt);
  console.log("Todas las fechas:", entries.map((e) => e.createdAt));

  return (
    <div >
      <div className="relative z-10 max-w-4xl mx-auto p-4 font-pixel">
        {/* Main kawaii container */}
        <div className="bg-orange-200 rounded-lg border-4 border-pink-500 shadow-2xl relative overflow-hidden">
          {/* Title bar - kawaii style */}
          <div className="bg-pink-500 p-4 border-b-4 border-pink-600 relative">
            <div className="text-center relative z-10">
              <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-2">
                📅 DIARY VIEWER 📅
              </h2>
              <div className="flex justify-center items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-pink-100 text-xs uppercase tracking-wider">READING MODE</span>
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
                  {editingTitle ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 text-lg font-bold border-2 border-pink-500 rounded px-2 py-1 bg-white text-pink-900 font-pixel"
                        autoFocus
                      />
                      <button
                        onClick={saveChanges}
                        className="px-3 py-1 bg-green-400 hover:bg-green-500 text-white rounded text-xs font-bold border-2 border-green-600"
                      >
                        ✓
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-xs font-bold border-2 border-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-lg font-bold flex-1 text-pink-900 uppercase tracking-wide">🌟 {entry.title}</h1>
                      {currentUser && (
                        <button
                          onClick={handleEditTitle}
                          className="px-2 py-1 bg-cyan-400 hover:bg-cyan-500 text-white rounded text-xs font-bold border-2 border-cyan-600"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="mb-4 relative z-10">
                  {editingContent ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="text-pink-900 border-2 border-pink-500 rounded px-2 py-1 min-h-[100px] resize-y bg-white font-pixel text-xs"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveChanges}
                          className="px-3 py-1 bg-green-400 hover:bg-green-500 text-white rounded text-xs font-bold border-2 border-green-600"
                        >
                          💾 SAVE
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-xs font-bold border-2 border-gray-600"
                        >
                          ❌ CANCEL
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <p className="text-pink-900 flex-1 text-xs leading-relaxed">{entry.content}</p>
                      {currentUser && (
                        <button
                          onClick={handleEditContent}
                          className="px-2 py-1 bg-cyan-400 hover:bg-cyan-500 text-white rounded text-xs font-bold self-start border-2 border-cyan-600"
                        >
                          ✏️
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-pink-500 relative z-10">
                  <div className="bg-pink-700 text-white px-2 py-1 rounded text-xs border border-pink-800">
                    {entry.updatedAt && entry.updatedAt !== entry.createdAt
                      ? `📝 EDITED: ${formatDate(entry.updatedAt)}`
                      : `📅 WRITTEN: ${formatDate(entry.createdAt)}`}
                  </div>
                  <div className="text-pink-700 text-xs">★ Entry #{currentIndex + 1}</div>
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
                disabled={currentIndex === 0 || editingTitle || editingContent}
                className="px-4 py-3 bg-purple-400 hover:bg-purple-500 text-white rounded border-4 border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105"
              >
                ⬅️ PREV
              </button>
              <button
                onClick={handleDelete}
                disabled={editingTitle || editingContent || !currentUser}
                className="flex-1 mx-2 px-4 py-3 bg-red-400 hover:bg-red-500 text-white rounded border-4 border-red-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105"
              >
                🗑️ DELETE
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === entries.length - 1 || editingTitle || editingContent}
                className="px-4 py-3 bg-blue-400 hover:bg-blue-500 text-white rounded border-4 border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider transition-all transform hover:scale-105"
              >
                NEXT ➡️
              </button>
            </div>
            
            {/* Counter */}
            <div className="text-center mt-4">
              <div className="bg-yellow-400 text-pink-900 px-4 py-2 rounded border-4 border-yellow-600 font-bold text-xs inline-block">
                📚 {currentIndex + 1} of {entries.length} ENTRIES
              </div>
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
              username={currentUser?.username} 
              diaryId={entry.id} 
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
              username={currentUser?.username} 
              diaryId={entry.id} 
              currentUserId={currentUser?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
