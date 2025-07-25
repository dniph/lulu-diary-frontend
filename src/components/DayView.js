'use client';

import { useState, useEffect } from 'react';
import { parseISO, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';

const mockEntries = [
  {
    id: 1,
    title: 'Primer día en Lulu Diary',
    content: 'Hoy empecé a crear mi diario personal con React y Tailwind.',
    date: '2025-07-20',
  },
  {
    id: 2,
    title: 'Aprendiendo validación',
    content: 'Implementé un formulario de login con validación simple.',
    date: '2025-07-22',
  },
];

export default function DayView() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const today = new Date();

    const todayIndex = mockEntries.findIndex((entry) =>
      isSameDay(parseISO(entry.date), today)
    );

    if (todayIndex !== -1) {
      setCurrentIndex(todayIndex);
    } else {
      // Si no hay entrada de hoy, muestra la más reciente anterior
      const pastEntries = mockEntries.filter(entry => parseISO(entry.date) <= today);
      if (pastEntries.length > 0) {
        const lastPastEntry = pastEntries[pastEntries.length - 1];
        setCurrentIndex(mockEntries.findIndex(e => e.id === lastPastEntry.id));
      } else {
        setCurrentIndex(0); // Por defecto, muestra la primera
      }
    }
  }, []);

  const entry = mockEntries[currentIndex];

  const handleNext = () => {
    if (currentIndex < mockEntries.length - 1) {
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

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold text-center text-gray-700 mb-2">
        {formatDate(entry.date)}
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
          disabled={currentIndex === mockEntries.length - 1}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}