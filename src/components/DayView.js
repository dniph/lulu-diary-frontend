'use client';

import { useState, useEffect } from 'react';
import { parseISO, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import Comments from './Comments';

export default function DayView({ refreshTrigger = 0, username = 'dniph' }) {
  const [entries, setEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingContent, setEditingContent] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries`);
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
  }, [refreshTrigger, username]);

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
    const entryToDelete = entries[currentIndex];
    if (!entryToDelete) return;

    const confirmDelete = window.confirm(`¿Eliminar la entrada "${entryToDelete.title}"?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries/${entryToDelete.id}`, {
        method: 'DELETE',
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
    const entry = entries[currentIndex];
    setEditTitle(entry.title);
    setEditingTitle(true);
  };

  const handleEditContent = () => {
    const entry = entries[currentIndex];
    setEditContent(entry.content);
    setEditingContent(true);
  };

  const saveChanges = async () => {
    const entry = entries[currentIndex];
    try {
      const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
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

  if (loading) return <p className="text-center mt-10">Cargando entradas...</p>;
  if (entries.length === 0) return <p className="text-center mt-10">No hay entradas para mostrar.</p>;
  
  const entry = entries[currentIndex];
  const isLastEntry = currentIndex === entries.length - 1;
  console.log('Mostrando entrada del:', entry.createdAt);
  console.log("Índice actual:", currentIndex);
  console.log("Fecha actual:", entries[currentIndex]?.createdAt);
  console.log("Todas las fechas:", entries.map((e) => e.createdAt));

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-center text-gray-700 flex-1">
          {formatDate(entry.createdAt)}
        </h2>
        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          {getVisibilityIcon(entry.visibility)} {getVisibilityText(entry.visibility)}
        </span>
      </div>
      
      {/* Título */}
      <div className="mb-4">
        {editingTitle ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 text-2xl font-bold border-2 border-blue-300 rounded px-2 py-1"
              autoFocus
            />
            <button
              onClick={saveChanges}
              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
            >
              ✓
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold flex-1">{entry.title}</h1>
            <button
              onClick={handleEditTitle}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
            >
              ✏️
            </button>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="mb-4">
        {editingContent ? (
          <div className="flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="text-gray-700 border-2 border-blue-300 rounded px-2 py-1 min-h-[100px] resize-y"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={saveChanges}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm"
              >
                Guardar
              </button>
              <button
                onClick={cancelEdit}
                className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <p className="text-gray-700 flex-1">{entry.content}</p>
            <button
              onClick={handleEditContent}
              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm self-start"
            >
              ✏️
            </button>
          </div>
        )}
      </div>
      <p className="text-sm text-gray-500 text-right italic">
        {entry.updatedAt && entry.updatedAt !== entry.createdAt
          ? `Editado el ${formatDate(entry.updatedAt)}`
          : `Escrito el ${formatDate(entry.createdAt)}`}
      </p>
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0 || editingTitle || editingContent}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={handleDelete}
          disabled={editingTitle || editingContent}
          className="flex-1 mx-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded disabled:opacity-50"
        >
          Eliminar
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === entries.length - 1 || editingTitle || editingContent}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
      
      {/* Comments Section */}
      <Comments 
        username={username} 
        diaryId={entry.id} 
        currentUser="dniph" // TODO: Replace with actual authenticated user
      />
    </div>
  );
}
