'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
    <div className="min-h-screen relative overflow-hidden font-kawaii">
      {/* Background with pixel art sky */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/CIELO PIXEL ART.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/30 to-purple-100/50"></div>
      </div>

      {/* Floating sparkles */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-2xl animate-float pointer-events-none z-10"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {sparkle.emoji}
        </div>
      ))}

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-8">
        {/* Welcome Panel - Stardew Valley Style */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-kawaii border-4 border-pink-200 p-8 max-w-2xl w-full text-center relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-4 left-4 text-pink-400 text-2xl animate-sparkle">🌸</div>
          <div className="absolute top-4 right-4 text-purple-400 text-2xl animate-sparkle" style={{animationDelay: '0.5s'}}>⭐</div>
          <div className="absolute bottom-4 left-4 text-blue-400 text-2xl animate-sparkle" style={{animationDelay: '1s'}}>✨</div>
          <div className="absolute bottom-4 right-4 text-pink-400 text-2xl animate-sparkle" style={{animationDelay: '1.5s'}}>💕</div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 animate-rainbow font-pixel">
              🌸 Lulu Diary 🌸
            </h1>
            <div className="flex justify-center items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></span>
              <span className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
              <span className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
            </div>
            <p className="text-xl text-gray-600 font-medium">
              ✨ Your magical kawaii diary adventure awaits! ✨
            </p>
          </div>

          {/* Time display - Stardew Valley style */}
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 mb-8 border-2 border-pink-200">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl animate-float">🕐</span>
              <div className="text-center">
                <p className="text-sm text-gray-500 font-medium">Current Time</p>
                <p className="text-2xl font-bold text-purple-600">{currentTime}</p>
              </div>
            </div>
          </div>

          {/* Action buttons - Stardew Valley inspired */}
          <div className="space-y-4">
            <Link href="/dniph">
              <button className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-8 rounded-2xl hover:from-pink-500 hover:to-pink-600 transition-all font-bold text-lg shadow-kawaii transform hover:scale-105 border-2 border-pink-300 relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <span>📖</span> Start Your Diary Journey <span>✨</span>
                </span>
                {/* Button sparkles */}
                <div className="absolute top-1 left-1/4 text-white/30 text-sm animate-sparkle">⭐</div>
                <div className="absolute bottom-1 right-1/4 text-white/30 text-sm animate-sparkle" style={{animationDelay: '0.5s'}}>✨</div>
              </button>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/login">
                <button className="w-full bg-gradient-to-r from-purple-400 to-purple-500 text-white py-3 px-6 rounded-2xl hover:from-purple-500 hover:to-purple-600 transition-all font-bold shadow-kawaii transform hover:scale-105 border-2 border-purple-300">
                  <span className="flex items-center justify-center gap-2">
                    <span>🔐</span> Login
                  </span>
                </button>
              </Link>

              <Link href="/register">
                <button className="w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 px-6 rounded-2xl hover:from-blue-500 hover:to-blue-600 transition-all font-bold shadow-kawaii transform hover:scale-105 border-2 border-blue-300">
                  <span className="flex items-center justify-center gap-2">
                    <span>🌟</span> Register
                  </span>
                </button>
              </Link>
            </div>
          </div>

          {/* Kawaii message */}
          <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-pink-50 rounded-2xl border-2 border-yellow-200">
            <p className="text-gray-600 font-medium flex items-center justify-center gap-2">
              <span className="animate-float">🌸</span>
              <span>Welcome to your personal kawaii space!</span>
              <span className="animate-float" style={{animationDelay: '0.5s'}}>🌸</span>
            </p>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-8 flex justify-center items-center gap-8">
          <div className="text-4xl animate-float">🌸</div>
          <div className="text-3xl animate-sparkle">⭐</div>
          <div className="text-4xl animate-float" style={{animationDelay: '0.5s'}}>💕</div>
          <div className="text-3xl animate-sparkle" style={{animationDelay: '0.8s'}}>✨</div>
          <div className="text-4xl animate-float" style={{animationDelay: '1s'}}>🌸</div>
        </div>

        {/* Kawaii footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 bg-white/70 px-4 py-2 rounded-full border border-pink-200">
            Made with 💕 for kawaii diary lovers
          </p>
        </div>
      </div>
    </div>
  );
}