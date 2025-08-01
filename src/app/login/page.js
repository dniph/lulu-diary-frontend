'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Por ahora, redirigir directamente al perfil
    // En el futuro aquí iría la lógica de autenticación
    if (formData.username) {
      window.location.href = `/${formData.username}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md mx-auto w-full px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔐 Iniciar Sesión</h1>
            <p className="text-gray-600">Accede a tu diario personal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="tu-usuario"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition font-medium"
            >
              🚀 Entrar a mi Diario
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                Crear una nueva
              </Link>
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/home"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Volver al inicio
            </Link>
          </div>

          {/* Demo note */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Demo:</strong> Usa dniph como usuario para acceder al perfil de prueba.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}