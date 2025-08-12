'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DiaryHomeButton() {
const [userProfile, setUserProfile] = useState(null);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/lulu-diary/me', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUserProfile(userData);
        }
      } catch (error) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  if (loading) {
    return (
      <button className="w-full bg-pink-300 text-white py-4 px-8 rounded-2xl border-4 border-pink-600 font-bold text-lg shadow-kawaii opacity-60 cursor-wait">
        Cargando...
      </button>
    );
  }

  if (!userProfile) {
    return (
      <Link href="/login">
        <button className="w-full bg-pink-400 text-white py-4 px-8 rounded-2xl border-4 border-pink-600 hover:bg-pink-500 transition-all font-bold text-lg shadow-kawaii">
          <span className="flex items-center justify-center gap-3">
            <span>🔐</span> Log in to view your diary
          </span>
        </button>
      </Link>
    );
  }

  return (
    <Link href={`/${userProfile.username}`}>
      <button className="w-full bg-gradient-to-r from-pink-400 to-pink-500 text-white py-4 px-8 rounded-2xl border-4 border-pink-600 hover:from-pink-500 hover:to-pink-600 transition-all font-bold text-lg shadow-kawaii transform hover:scale-105 relative overflow-hidden">
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span>📖</span> Go to my diary <span>✨</span>
        </span>
        <div className="absolute top-1 left-1/4 text-white/30 text-sm animate-sparkle">⭐</div>
        <div className="absolute bottom-1 right-1/4 text-white/30 text-sm animate-sparkle" style={{animationDelay: '0.5s'}}>✨</div>
      </button>
    </Link>
  );
}
