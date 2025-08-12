"use client";

import { useEffect, useState } from "react";

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFeed() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/lulu-diary/feed?limit=20");
        if (!res.ok) throw new Error("Error al cargar el feed");
        const data = await res.json();
        // Adaptar al esquema: { data: [...] }
        setFeed(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError(err.message);
        setFeed([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 font-pixel">
        <span className="animate-spin rounded-full h-8 w-8 border-b-4 border-pink-500 mr-2"></span>
        <span className="text-pink-700 font-bold text-lg">Cargando feed...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-pixel py-8">{error}</div>
    );
  }

  if (!feed || feed.length === 0) {
    return (
      <div className="text-center text-cyan-600 font-pixel py-8">
        <span className="text-3xl">🌸</span>
        <div>No hay entradas en el feed todavía.</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {feed.map((item) => {
        const { diary, profile } = item;
        return (
          <div key={diary.id} className="bg-white/80 rounded-lg border-4 border-pink-300 shadow-lg p-4 font-pixel relative overflow-hidden">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-pink-300 shadow">
                {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : (profile.username ? profile.username.charAt(0).toUpperCase() : "👤")}
              </div>
              <div>
                <div className="font-bold text-pink-800">{profile.displayName || `@${profile.username}`}</div>
                <div className="text-xs text-cyan-600 font-mono">@{profile.username}</div>
              </div>
              <div className="ml-auto text-xs text-pink-400 font-mono">
                {diary.createdAt && new Date(diary.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-bold text-purple-700">{diary.title}</span>
            </div>
            <div className="text-pink-700 text-sm mb-2 whitespace-pre-line">
              {diary.content}
            </div>
            <div className="flex gap-2 text-xs">
              <span className="bg-pink-200 text-pink-700 px-2 py-1 rounded-full border border-pink-400">{diary.visibility === "public" ? "🌍 Público" : diary.visibility === "friends-only" ? "👥 Solo amigos" : "🔒 Privado"}</span>
            </div>
            {/* Kawaii-style corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 bg-pink-400 border-r-2 border-b-2 border-pink-700"></div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-pink-400 border-l-2 border-b-2 border-pink-700"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-400 border-r-2 border-t-2 border-pink-700"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-400 border-l-2 border-t-2 border-pink-700"></div>
          </div>
        );
      })}
    </div>
  );
}
