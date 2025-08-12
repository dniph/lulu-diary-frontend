'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import DiaryHomeButton from '@/components/DiaryHomeButton';
import Feed from '@/components/Feed';

export default function Home() {
  const [currentTime, setCurrentTime] = useState('');
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });
      setCurrentTime(timeString);
    }, 1000);

    // Generate random sparkles
    const generateSparkles = () => {
      const newSparkles = [];
      for (let i = 0; i < 15; i++) {
        newSparkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          delay: Math.random() * 3,
          emoji: ['✨', '⭐', '🌟', '💫'][Math.floor(Math.random() * 4)]
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat relative font-pixel" style={{backgroundImage: "url('/images/CIELO PIXEL ART.png')"}}>
      <div className="relative z-10 flex flex-col justify-center min-h-screen">
        <div className="max-w-md mx-auto w-full px-4">
          <div className="bg-cyan-200 rounded-lg border-4 border-purple-500 shadow-2xl relative overflow-hidden font-pixel">
            {/* Title bar - kawaii style */}
            <div className="bg-purple-500 p-4 border-b-4 border-purple-600 relative">
              <div className="text-center relative z-10">
                <h2 className="text-white text-2xl font-bold uppercase tracking-widest mb-2">
                  🌸 Lulu Diary 🌸
                </h2>
                <div className="flex justify-center items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-purple-100 text-xs uppercase tracking-wider">HOME</span>
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
                    ✨ Your magical kawaii diary adventure awaits! ✨
                  </p>
                </div>
              </div>

              {/* Time display - kawaii style */}
              <div className="bg-orange-100 rounded-lg border-4 border-orange-500 p-6 relative overflow-hidden mb-6">
                <div className="bg-orange-400 p-3 border-b-4 border-orange-500 mb-6 relative -mx-6 -mt-6">
                  <h3 className="text-white text-lg font-bold uppercase tracking-wider text-center">
                    🕐 Current Time
                  </h3>
                  <div className="absolute top-1 left-2 w-2 h-2 bg-yellow-400"></div>
                  <div className="absolute top-1 right-2 w-2 h-2 bg-yellow-400"></div>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl animate-float">🕐</span>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{currentTime}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons - kawaii style */}
              <DiaryHomeButton />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Link href="/login">
                  <button className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white py-3 px-6 rounded-2xl border-4 border-purple-600 hover:from-purple-500 hover:to-purple-600 transition-all font-bold shadow-kawaii transform hover:scale-105">
                    <span className="flex items-center justify-center gap-2">
                      <span>🔐</span> Login
                    </span>
                  </button>
                </Link>
                <Link href="/register">
                  <button className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-6 rounded-2xl border-4 border-blue-600 hover:from-blue-500 hover:to-blue-600 transition-all font-bold shadow-kawaii transform hover:scale-105">
                    <span className="flex items-center justify-center gap-2">
                      <span>🌟</span> Register
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {/* Feed below the main card */}
        <div className="max-w-2xl mx-auto w-full px-4">
          <Feed />
        </div>
      </div>
    </div>
  );
}