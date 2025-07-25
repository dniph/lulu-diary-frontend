import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <AuthForm />
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {/* Aquí luego irá el formulario de login */}
    </div>
  );
}