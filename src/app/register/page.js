'use client';

import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  const handleRegister = (formData) => {
    // Validación ya manejada en AuthForm
    // Por ahora, redirigir directamente al perfil
    // En el futuro aquí iría la lógica de registro
    if (formData.username) {
      window.location.href = `/${formData.username}`;
    }
  };

  return (
    <AuthForm 
      type="register" 
      onSubmit={handleRegister}
    />
  );
}
