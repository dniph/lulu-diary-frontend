'use client';

import { useState, useEffect } from 'react';
import { parseISO, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function DayView() {
  const [entries, setEntries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        const res = await fetch('http://localhost:5180/api/diaries?username=LuluHot69');
        if (!res.ok) throw new Error('Error al obtener las entradas');
        const data = await res.json();

        // Ordenar por fecha ascendente (más antigua primero)
        data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setEntries(data);

        const today = new Date();
        const todayIndex = data.findIndex((entry) =>
          isSameDay(parseISO(entry.createdAt), today)
        );

        if (todayIndex !== -1) {
          setCurrentIndex(todayIndex);
        } else {
          const pastEntries = data.filter(entry => parseISO(entry.createdAt) <= today);
          if (pastEntries.length > 0) {
            const lastPastEntry = pastEntries[pastEntries.length - 1];
            setCurrentIndex(data.findIndex(e => e.id === lastPastEntry.id));
          } else {
            setCurrentIndex(0);
          }
        }
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

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
    format(parseISO(dateString), 'EEEE d MMMM yyyy', { locale: es });

  if (loading) return <p className="text-center mt-10">Cargando entradas...</p>;
  if (entries.length === 0) return <p className="text-center mt-10">No hay entradas para mostrar.</p>;

  const entry = entries[currentIndex];

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center text-gray-700 mb-2">
        {formatDate(entry.createdAt)}
      </h2>
      <h1 className="text-2xl font-bold mb-4">{entry.title}</h1>
      <p className="text-gray-700 mb-4">{entry.content}</p>
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === entries.length - 1}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
