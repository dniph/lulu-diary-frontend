'use client';

import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const handleLogin = (formData) => {
    // Por ahora, redirigir directamente al perfil
    // En el futuro aquí iría la lógica de autenticación
    if (formData.username) {
      window.location.href = `/${formData.username}`;
    }
  };

  return (
    <AuthForm 
      type="login" 
      onSubmit={handleLogin}
    />
  );
}