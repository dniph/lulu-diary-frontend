'use client';

import { useState } from 'react';

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
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
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
      username: 'LuluHot69'
    };

    try {
      const res = await fetch('http://localhost:5180/api/diaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEntry),
      });

      if (res.ok) {
        const savedEntry = await res.json();
        setEntries((prev) => [savedEntry, ...prev]);
        setFormData({ title: '', content: '' });
        setShowForm(false);
      } else {
        console.error('Error al crear entrada');
      }
    } catch (error) {
      console.error('Error en la petición:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Mi Diario</h1>

      <button
        className="mb-6 bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancelar' : '+ Nueva Entrada'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            required
          />
          <textarea
            name="content"
            placeholder="Contenido"
            value={formData.content}
            onChange={handleChange}
            className="w-full mb-2 p-2 border rounded"
            rows="4"
            required
          ></textarea>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Guardar Entrada
          </button>
        </form>
      )}

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
