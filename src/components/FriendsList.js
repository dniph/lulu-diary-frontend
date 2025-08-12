'use client';

import { useState, useEffect } from 'react';

export default function FriendsList({ username, currentUserId = 1, isOwnProfile = false }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load friends on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/lulu-diary/profiles/${username}/friends`, {
          headers: {
            'X-Current-User-Id': currentUserId.toString(),
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error('Error al obtener amigos');
        const data = await res.json();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchFriends();
    }
  }, [username, currentUserId]);

  // Filter friends based on search term
  const filteredFriends = friends.filter(friend => {
    const name = friend.friendName || friend.name || `User ${friend.friendId || friend.id}`;
    const friendUsername = friend.friendUsername || friend.username || `user${friend.friendId || friend.id}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           friendUsername.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 font-pixel">
        <div className="bg-yellow-100 rounded-lg border-4 border-orange-500 shadow-2xl p-6 flex flex-col items-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-4 border-pink-500 mb-2"></div>
          <span className="text-pink-700 font-bold text-lg">Loading friends...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-pink-100 rounded-lg border-4 border-pink-500 shadow-lg p-6 font-pixel relative overflow-hidden">
      {/* Decorative border */}
      <div className="absolute inset-0 border-4 border-pink-300 rounded-lg m-2 pointer-events-none"></div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-pink-800 uppercase tracking-wider flex items-center gap-2">
          <span>👾</span> {isOwnProfile ? 'Mis Amigos' : `Amigos de @${username}`}
        </h2>
        <div className="text-sm text-pink-500 font-bold">
          {friends.length} {friends.length === 1 ? 'amigo' : 'amigos'}
        </div>
      </div>

      {/* Search Bar */}
      {friends.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search friends..."
            className="w-full px-4 py-2 border-2 border-pink-400 rounded-lg font-pixel text-pink-700 bg-pink-50 focus:ring-2 focus:ring-pink-300 focus:border-pink-500 placeholder-pink-300"
          />
        </div>
      )}

      {/* Friends Grid */}
      {filteredFriends.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map((friend) => {
            const friendName = friend.friendName || friend.name || `Usuario ${friend.friendId || friend.id}`;
            const friendUsername = friend.friendUsername || friend.username || `user${friend.friendId || friend.id}`;
            const friendId = friend.friendId || friend.id;
            return (
              <div key={friendId} className="p-4 bg-cyan-50 rounded-lg border-4 border-cyan-300 shadow-md hover:bg-cyan-100 transition-colors relative overflow-hidden">
                {/* Decorative border */}
                <div className="absolute inset-0 border-2 border-cyan-200 rounded-lg m-1 pointer-events-none"></div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold border-2 border-pink-300 shadow">
                    {friendName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-cyan-900 text-lg">{friendName}</div>
                    <div className="text-xs text-cyan-600 font-mono">@{friendUsername}</div>
                  </div>
                </div>
                {/* Friend since date */}
                {friend.friendSince && (
                  <div className="text-xs text-cyan-500 mb-3 font-mono">
                    Amigos desde {new Date(friend.friendSince).toLocaleDateString()}
                  </div>
                )}
                {/* Action buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.location.href = `/${friendUsername}`}
                    className="flex-1 px-3 py-1.5 bg-pink-400 text-white text-xs font-bold rounded-lg border-2 border-pink-600 hover:bg-pink-500 transition-all shadow"
                  >
                    Ver Perfil
                  </button>
                  <button 
                    onClick={() => window.location.href = `/${friendUsername}`}
                    className="flex-1 px-3 py-1.5 bg-cyan-400 text-white text-xs font-bold rounded-lg border-2 border-cyan-600 hover:bg-cyan-500 transition-all shadow"
                  >
                    Ver Diario
                  </button>
                </div>
                {/* Mutual friends indicator (if available) */}
                {friend.mutualFriendsCount && friend.mutualFriendsCount > 0 && (
                  <div className="mt-2 text-xs text-pink-500 text-center font-mono">
                    {friend.mutualFriendsCount} amigo{friend.mutualFriendsCount !== 1 ? 's' : ''} en común
                  </div>
                )}
                {/* Kawaii-style corner decorations */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-pink-400 border-r-2 border-b-2 border-pink-700"></div>
                <div className="absolute top-0 right-0 w-2 h-2 bg-pink-400 border-l-2 border-b-2 border-pink-700"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-400 border-r-2 border-t-2 border-pink-700"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-400 border-l-2 border-t-2 border-pink-700"></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          {searchTerm ? (
            // No search results
            <div className="text-pink-500 font-pixel">
              <div className="text-5xl mb-2">🔍</div>
              <p className="font-bold">No se encontraron amigos con &ldquo;{searchTerm}&rdquo;</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-cyan-600 hover:text-cyan-800 text-sm font-bold underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            // No friends at all
            <div className="text-cyan-500 font-pixel">
              <div className="text-5xl mb-2">👫</div>
              <p className="font-bold">
                {isOwnProfile 
                  ? "You don't have any friends yet. Send some friend requests!"
                  : `@${username} doesn't have any public friends yet.`
                }
              </p>
              {isOwnProfile && (
                <p className="text-xs mt-2 text-cyan-400">
                  Go to &quot;Friend Requests&quot; to connect with other users.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Friends count summary */}
      {friends.length > 0 && (
        <div className="mt-6 pt-4 border-t-2 border-pink-300 text-center">
          <div className="text-xs text-pink-600 font-bold">
            {searchTerm && filteredFriends.length !== friends.length ? (
              <span>
                Mostrando {filteredFriends.length} de {friends.length} amigos
              </span>
            ) : (
              <span>
                Total: {friends.length} {friends.length === 1 ? 'amigo' : 'amigos'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Kawaii-style corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 bg-pink-500 border-r-4 border-b-4 border-pink-900"></div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-pink-500 border-l-4 border-b-4 border-pink-900"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-pink-500 border-r-4 border-t-4 border-pink-900"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-pink-500 border-l-4 border-t-4 border-pink-900"></div>
    </div>
  );
}
