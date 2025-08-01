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
    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 flex-1">{title}</h3>
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 ml-2">
          {getVisibilityIcon(visibility)} {getVisibilityText(visibility)}
        </span>
      </div>
      <p className="text-gray-700 mb-3 line-clamp-3">{content}</p>
      <p className="text-sm text-gray-500">📅 {formatDate(date)}</p>
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
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">✍️ Escribir Nueva Entrada</h2>

      <button
        className="w-full mb-6 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-medium"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '❌ Cancelar' : '✨ + Nueva Entrada'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la entrada
            </label>
            <input
              type="text"
              name="title"
              placeholder="¿Qué título le pondrías a este día?"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              name="content"
              placeholder="Cuéntame sobre tu día, tus pensamientos, tus sentimientos..."
              value={formData.content}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visibilidad de la entrada
            </label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="private">🔒 Privado - Solo yo puedo verlo</option>
              <option value="friends-only">👥 Solo amigos - Visible para mis amigos</option>
              <option value="public">🌍 Público - Visible para todos</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.visibility === 'private' && '🔒 Esta entrada será completamente privada'}
              {formData.visibility === 'friends-only' && '👥 Solo tus amigos podrán ver esta entrada'}
              {formData.visibility === 'public' && '🌍 Esta entrada será visible públicamente'}
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition font-medium"
          >
            💾 Guardar Entrada
          </button>
        </form>
      )}

      {entries.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 Entradas Recientes</h3>
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
        </div>
      )}
    </div>
  );
}
