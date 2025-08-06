'use client';

import { useState } from 'react';

function Entry({ title, content, date, visibility }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  return (
    <div className="bg-pink-200 rounded-lg border-4 border-pink-600 shadow-lg relative overflow-hidden font-pixel text-sm transform hover:scale-105 transition-all duration-300">
      {/* Kawaii style border decoration */}
      <div className="absolute inset-0 border-2 border-pink-400 rounded-lg m-1"></div>
      
      {/* Header with kawaii-style title bar */}
      <div className="bg-pink-500 p-2 border-b-2 border-pink-600 relative">
        <div className="flex justify-between items-center">
          <h3 className="text-white font-bold text-xs flex-1 uppercase tracking-wider">
            📜 {title}
          </h3>
          <div className="bg-pink-700 px-2 py-1 rounded border border-pink-800 text-pink-100 text-xs">
            {getVisibilityIcon(visibility)} {getVisibilityText(visibility)}
          </div>
        </div>
        {/* Decorative pixels */}
        <div className="absolute top-1 left-2 w-1 h-1 bg-pink-200"></div>
        <div className="absolute top-1 right-2 w-1 h-1 bg-pink-200"></div>
      </div>

      {/* Content area with kawaii texture effect */}
      <div className="p-3 bg-cyan-100 relative">
        {/* Kawaii style dots pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.3) 1px, transparent 0)`,
          backgroundSize: '8px 8px'
        }}></div>
        
        <p className="text-pink-800 mb-2 leading-relaxed relative z-10 text-xs">
          {content}
        </p>
        
        {/* Kawaii-style date stamp */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-pink-300">
          <div className="bg-pink-600 text-pink-100 px-2 py-1 rounded text-xs border border-pink-700">
            📅 {formatDate(date)}
          </div>
          <div className="text-pink-500 text-xs">★ Entry #{Math.floor(Math.random() * 999)}</div>
        </div>
      </div>
      
      {/* Corner decorations like kawaii UI */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-pink-600 border-r border-b border-pink-700"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-pink-600 border-l border-b border-pink-700"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-600 border-r border-t border-pink-700"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-600 border-l border-t border-pink-700"></div>
    </div>
  );
}

export default function DiaryEntry({ onEntryCreated, username = 'dniph' }) {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    visibility: 'private', // Default to private
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEntry = {
      title: formData.title,
      content: formData.content,
      visibility: formData.visibility,
    };

    try {
      const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        const savedEntry = await res.json();
        setEntries((prev) => [savedEntry, ...prev]);
        setFormData({ title: '', content: '', visibility: 'private' });
        setShowForm(false);
        
        // Notify parent component that a new entry was created
        if (onEntryCreated) {
          onEntryCreated(savedEntry);
        }
      } else {
        console.error('Error al crear entrada');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 font-pixel">
      {/* Game-style main container - kawaii diary style */}
      <div className="bg-yellow-100 rounded-lg border-4 border-orange-500 shadow-2xl relative overflow-hidden">
        {/* Inner decorative border */}
        <div className="absolute inset-0 border-4 border-orange-400 rounded-lg m-2"></div>
        
        {/* Title bar - kawaii style */}
        <div className="bg-orange-400 p-4 border-b-4 border-orange-500 relative">
          <div className="text-center relative z-10">
            <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-2">
              🎮 DIARY CONSOLE 🎮
            </h2>
            <div className="flex justify-center items-center gap-2">
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <span className="text-orange-100 text-xs uppercase tracking-wider">WRITING MODE</span>
              <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Decorative corner elements */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-300 border border-yellow-400"></div>
          <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-300 border border-yellow-400"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-300 border border-yellow-400"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 bg-yellow-300 border border-yellow-400"></div>
        </div>

        <div className="p-6">
          {/* Action Button - Kawaii Style */}
          <button
            className="w-full bg-cyan-400 text-white py-4 px-6 rounded border-4 border-cyan-600 hover:bg-cyan-300 transition-all font-bold text-sm uppercase tracking-wider shadow-lg transform hover:scale-105 relative overflow-hidden"
            onClick={() => setShowForm(!showForm)}
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              {showForm ? (
                <>
                  <span>❌</span> CLOSE DIARY <span>📖</span>
                </>
              ) : (
                <>
                  <span>✨</span> NEW ENTRY <span>📝</span>
                </>
              )}
            </div>
            {/* Kawaii-style button corners */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-200 border-r border-b border-cyan-700"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-200 border-l border-b border-cyan-700"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-200 border-r border-t border-cyan-700"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-200 border-l border-t border-cyan-700"></div>
          </button>

        </div>

      {showForm && (
        <div className="mt-6 bg-pink-100 rounded-lg border-4 border-pink-500 p-6 relative overflow-hidden">
          {/* Form title bar */}
          <div className="bg-pink-400 p-3 border-b-4 border-pink-500 mb-6 relative -mx-6 -mt-6">
            <h3 className="text-white text-lg font-bold uppercase tracking-wider text-center">
              📖 WRITING INTERFACE 📖
            </h3>
            {/* Decorative elements */}
            <div className="absolute top-1 left-2 w-2 h-2 bg-pink-200"></div>
            <div className="absolute top-1 right-2 w-2 h-2 bg-pink-200"></div>
          </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input - Kawaii Style */}
          <div className="relative">
            <label className="block text-pink-700 text-sm font-bold mb-2 uppercase tracking-wide">
              🌟 ENTRY TITLE
            </label>
            <div className="bg-pink-50 border-4 border-pink-400 rounded p-1">
              <input
                type="text"
                name="title"
                placeholder="What happened today...?"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-pink-300 rounded text-pink-800 font-pixel text-xs placeholder-pink-400 focus:border-pink-500 focus:outline-none"
                required
              />
            </div>
          </div>
          
          {/* Content Textarea - Kawaii Style */}
          <div className="relative">
            <label className="block text-pink-700 text-sm font-bold mb-2 uppercase tracking-wide">
              📝 STORY CONTENT
            </label>
            <div className="bg-pink-50 border-4 border-pink-400 rounded p-1">
              <textarea
                name="content"
                placeholder="Tell your story... What adventures did you have? What did you discover? How do you feel?"
                value={formData.content}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-pink-300 rounded text-pink-800 font-pixel text-xs placeholder-pink-400 resize-none focus:border-pink-500 focus:outline-none"
                rows="8"
                required
              />
            </div>
          </div>

          {/* Visibility Selector - Kawaii Style */}
          <div className="relative">
            <label className="block text-pink-700 text-sm font-bold mb-2 uppercase tracking-wide">
              🔮 SHARING SETTINGS
            </label>
            <div className="bg-pink-50 border-4 border-pink-400 rounded p-1">
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full p-3 bg-white border-2 border-pink-300 rounded text-pink-800 font-pixel text-xs focus:border-pink-500 focus:outline-none"
              >
                <option value="private">🔒 PRIVATE - My Secret</option>
                <option value="friends-only">👥 FRIENDS - Share with Buddies</option>
                <option value="public">🌍 PUBLIC - Everyone Can Read</option>
              </select>
            </div>
            <div className="mt-2 p-2 bg-yellow-100 border-2 border-yellow-400 rounded">
              <p className="text-orange-700 text-xs font-bold uppercase">
                {formData.visibility === 'private' && '🔒 LOCKED ENTRY - Only you can see this'}
                {formData.visibility === 'friends-only' && '👥 FRIENDS ONLY - Your friends can read this'}
                {formData.visibility === 'public' && '🌍 PUBLIC ENTRY - Visible to everyone'}
              </p>
            </div>
          </div>
          
          {/* Submit Button - Kawaii Style */}
          <button
            type="submit"
            className="w-full bg-green-400 text-white py-4 px-6 rounded border-4 border-green-600 hover:bg-green-300 transition-all font-bold text-sm uppercase tracking-wider shadow-lg transform hover:scale-105 relative overflow-hidden"
          >
            <div className="relative z-10 flex items-center justify-center gap-2">
              <span>💾</span> SAVE ENTRY <span>✨</span>
            </div>
            {/* Button corners */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-green-200"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-green-200"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-200"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-200"></div>
          </button>
        </form>
        </div>
      )}

      {entries.length > 0 && (
        <div className="mt-6 bg-purple-100 rounded-lg border-4 border-purple-500 p-6 relative overflow-hidden">
          {/* Recent entries header */}
          <div className="bg-purple-400 p-3 border-b-4 border-purple-500 mb-6 relative -mx-6 -mt-6">
            <h3 className="text-white text-lg font-bold uppercase tracking-wider text-center">
              📚 RECENT ENTRIES 📚
            </h3>
            <div className="absolute top-1 left-2 w-2 h-2 bg-purple-200"></div>
            <div className="absolute top-1 right-2 w-2 h-2 bg-purple-200"></div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {entries.slice(0, 3).map((entry) => (
              <Entry
                key={entry.id}
                title={entry.title}
                content={entry.content}
                date={entry.createdAt}
                visibility={entry.visibility}
              />
            ))}
          </div>

          {/* View All Button */}
          {entries.length > 3 && (
            <div className="text-center mt-4">
              <button className="bg-purple-400 text-white py-3 px-6 rounded border-4 border-purple-600 hover:bg-purple-300 transition-all font-bold text-sm uppercase tracking-wider">
                📖 VIEW ALL ENTRIES ✨
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
