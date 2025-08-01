import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-6xl font-bold text-white mb-6">
          📖 Lulu Diary
        </h1>
        <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
          Tu espacio personal para escribir, reflexionar y recordar los momentos más importantes de tu vida.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold mb-2">Escribe Libremente</h3>
            <p className="text-white/80">Expresa tus pensamientos, sentimientos y experiencias sin límites.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Privacidad Total</h3>
            <p className="text-white/80">Controla quién puede ver tus entradas: privado, amigos o público.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Organizado por Fechas</h3>
            <p className="text-white/80">Navega fácilmente por tus recuerdos organizados cronológicamente.</p>
          </div>
        </div>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/login"
            className="inline-block bg-white text-purple-600 font-semibold py-3 px-8 rounded-full hover:bg-gray-100 transition shadow-lg"
          >
            🚀 Iniciar Sesión
          </Link>
          <Link
            href="/register"
            className="inline-block bg-transparent border-2 border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-purple-600 transition"
          >
            📝 Crear Cuenta
          </Link>
        </div>
        
        <div className="mt-16 text-white/60">
          <p>¿Ya tienes cuenta? Visita tu perfil directamente: <span className="font-mono bg-white/10 px-2 py-1 rounded">luludiary.com/tu-usuario</span></p>
        </div>
      </div>
    </div>
  );
}
