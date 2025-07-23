'use client';
import DayView from '@/components/DayView';
import { useState } from 'react';

const mockEntries = [
  {
    id: 1,
    title: 'Primer día en Lulu Diary',
    content: 'Hoy empecé a crear mi diario personal con React y Tailwind.',
    date: '2025-07-23',
  },
  {
    id: 2,
    title: 'Aprendiendo validación',
    content: 'Implementé un formulario de login con validación simple.',
    date: '2025-07-24',
  },
];

function Entry({ title, content, date }) {
  return (
    <div className="border rounded p-4 mb-4 bg-white shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 mb-2">{content}</p>
      <p className="text-sm text-gray-400">{date}</p>
    </div>
  );
}

export default function DiaryPage() {
  const [entries, setEntries] = useState(mockEntries);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Mi Diario</h1>
      <button
        className="mb-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        onClick={() => alert('Boton no conectado')}
      >
        + Nueva Entrada
      </button>

      {entries.length === 0 ? (
        <p className="text-center text-gray-500">No hay entradas aún.</p>
      ) : (
        entries.map((entry) => (
          <Entry
            key={entry.id}
            title={entry.title}
            content={entry.content}
            date={entry.date}
          />
        ))
      )}
    </div>
  );
}
