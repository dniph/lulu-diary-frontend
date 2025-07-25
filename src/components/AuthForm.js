'use client';

import { useState } from 'react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
      </h2>

      <form className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            className="w-full p-3 border border-gray-300 rounded"
          />
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border border-gray-300 rounded"
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border border-gray-300 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
        >
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
        <button onClick={toggleForm} className="text-blue-600 underline">
          {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
        </button>
      </p>
    </div>
  );
}
