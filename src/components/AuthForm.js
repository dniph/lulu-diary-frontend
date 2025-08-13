'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp, signIn } from '@/lib/users';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export default function AuthForm({ 
  type = 'login', // 'login' or 'register'
  onSubmit,
  showBackToHome = true 
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isLogin = type === 'login';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    let result;

    if (isLogin) {
      result = await signIn(formData.email, formData.password);
    } else {
      result = await signUp(formData.email, formData.password, formData.name);
    }

    const { success, message } = result;

    if (success) {
      router.push('/');
    } else {
      console.log(message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative font-pixel bg-fixed" style={{backgroundImage: "url('/images/CIELO PIXEL ART.png')"}}>
      <div className="relative z-10 flex flex-col justify-center min-h-screen">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="bg-cyan-200 rounded-lg border-4 border-purple-500 shadow-2xl relative overflow-hidden font-pixel">
            {/* Title bar - kawaii style */}
            <div className="bg-purple-500 p-4 border-b-4 border-purple-600 relative">
              <div className="text-center relative z-10">
                <h2 className="text-white text-xl font-bold uppercase tracking-widest mb-2">
                  {isLogin ? '🔐 LOGIN CONSOLE 🔐' : '📝 REGISTER CONSOLE 📝'}
                </h2>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-100 text-xs uppercase tracking-wider">AUTH MODE</span>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-yellow-400 border border-yellow-500"></div>
            </div>

            <div className="p-6">
              {/* Welcome message - kawaii style */}
              <div className="bg-pink-200 rounded-lg border-4 border-pink-600 shadow-lg relative overflow-hidden mb-6">
                <div className="absolute inset-0 border-2 border-pink-400 rounded-lg m-1"></div>
                
                <div className="bg-pink-500 p-3 border-b-2 border-pink-600 relative">
                  <div className="text-center">
                    <h3 className="text-white font-bold text-sm uppercase tracking-wider">
                      ✨ WELCOME MESSAGE ✨
                    </h3>
                  </div>
                  <div className="absolute top-1 left-2 w-1 h-1 bg-yellow-300"></div>
                  <div className="absolute top-1 right-2 w-1 h-1 bg-yellow-300"></div>
                </div>

                <div className="p-4 bg-cyan-300 relative">
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(219, 39, 119, 0.3) 1px, transparent 0)`,
                    backgroundSize: '8px 8px'
                  }}></div>
                  
                  <p className="text-pink-900 text-xs text-center relative z-10 uppercase tracking-wide">
                    {isLogin ? 'ACCESS YOUR KAWAII DIARY!' : 'JOIN THE KAWAII COMMUNITY!'}
                  </p>
                </div>
              </div>

              {/* Form container - kawaii style */}
              <div className="bg-orange-100 rounded-lg border-4 border-orange-500 p-6 relative overflow-hidden">
                <div className="bg-orange-400 p-3 border-b-4 border-orange-500 mb-6 relative -mx-6 -mt-6">
                  <h3 className="text-white text-lg font-bold uppercase tracking-wider text-center">
                    🎮 INPUT INTERFACE 🎮
                  </h3>
                  <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-400"></div>
                  <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-400"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="relative">
                      <label className="block text-orange-700 text-sm font-bold mb-2 uppercase tracking-wide">
                        🌟 NAME
                      </label>
                      <div className="bg-orange-50 border-4 border-orange-400 rounded p-1">
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 bg-white border-2 border-orange-300 rounded text-orange-800 font-pixel text-xs placeholder-orange-400 focus:border-orange-500 focus:outline-none"
                          placeholder="Your kawaii name..."
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-orange-700 text-sm font-bold mb-2 uppercase tracking-wide">
                      📧 EMAIL
                    </label>
                    <div className="bg-orange-50 border-4 border-orange-400 rounded p-1">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border-2 border-orange-300 rounded text-orange-800 font-pixel text-xs placeholder-orange-400 focus:border-orange-500 focus:outline-none"
                        placeholder="your@kawaii.email"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-orange-700 text-sm font-bold mb-2 uppercase tracking-wide">
                      🔒 PASSWORD
                    </label>
                    <div className="bg-orange-50 border-4 border-orange-400 rounded p-1">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 bg-white border-2 border-orange-300 rounded text-orange-800 font-pixel text-xs placeholder-orange-400 focus:border-orange-500 focus:outline-none"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="relative">
                      <label className="block text-orange-700 text-sm font-bold mb-2 uppercase tracking-wide">
                        🔐 CONFIRM PASSWORD
                      </label>
                      <div className="bg-orange-50 border-4 border-orange-400 rounded p-1">
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full p-3 bg-white border-2 border-orange-300 rounded text-orange-800 font-pixel text-xs placeholder-orange-400 focus:border-orange-500 focus:outline-none"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-green-400 text-white py-4 px-6 rounded border-4 border-green-600 hover:bg-green-300 transition-all font-bold text-sm uppercase tracking-wider shadow-lg transform hover:scale-105 relative overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isLogin ? (
                        <>
                          <span>🚀</span> ENTER DIARY <span>✨</span>
                        </>
                      ) : (
                        <>
                          <span>🎉</span> CREATE DIARY <span>📖</span>
                        </>
                      )}
                    </div>
                    <div className="absolute top-0 left-0 w-2 h-2 bg-green-200"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 bg-green-200"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 bg-green-200"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-200"></div>
                  </button>
                </form>
              </div>

              {/* Divider - kawaii style */}
              <div className="flex items-center my-6">
                <div className="flex-grow h-1 bg-purple-400 border border-purple-600"></div>
                <div className="px-3 bg-purple-500 text-white text-xs font-bold border-2 border-purple-700 rounded">OR</div>
                <div className="flex-grow h-1 bg-purple-400 border border-purple-600"></div>
              </div>

              {/* Google Sign In Button - kawaii style */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-blue-400 text-white py-4 px-6 rounded border-4 border-blue-600 hover:bg-blue-300 transition-all font-bold text-sm uppercase tracking-wider shadow-lg transform hover:scale-105 relative overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>GOOGLE LOGIN</span>
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 bg-blue-200"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-blue-200"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-200"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-200"></div>
              </button>

              {/* Links Section - kawaii style */}
              <div className="mt-6 space-y-4">
                <div className="bg-pink-100 rounded border-2 border-pink-400 p-3 text-center">
                  <p className="text-pink-800 text-xs font-bold uppercase">
                    {isLogin ? '¿NO TIENES CUENTA?' : '¿YA TIENES CUENTA?'}{' '}
                    <Link 
                      href={isLogin ? '/register' : '/login'} 
                      className="text-purple-600 hover:text-purple-700 font-bold underline"
                    >
                      {isLogin ? 'CREATE NEW' : 'LOGIN HERE'}
                    </Link>
                  </p>
                </div>

                {showBackToHome && (
                  <div className="text-center">
                    <Link
                      href="/home"
                      className="text-white bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded border-2 border-gray-700 text-xs font-bold uppercase transition"
                    >
                      ← BACK TO HOME
                    </Link>
                  </div>
                )}

                {/* Demo note - kawaii style */}
                {isLogin && (
                  <div className="bg-cyan-100 rounded border-2 border-cyan-400 p-3">
                    <p className="text-cyan-800 text-xs font-bold uppercase text-center">
                      🎮 DEMO MODE: USE ANY VALID EMAIL! 🎮
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
