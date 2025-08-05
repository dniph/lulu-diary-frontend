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
        const res = await fetch(`http://localhost:5180/api/profiles/${username}/friends`, {
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
    const name = friend.friendName || friend.name || `Usuario ${friend.friendId || friend.id}`;
    const friendUsername = friend.friendUsername || friend.username || `user${friend.friendId || friend.id}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           friendUsername.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-500">Cargando amigos...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          {isOwnProfile ? 'Mis Amigos' : `Amigos de @${username}`}
        </h2>
        <div className="text-sm text-gray-500">
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
            placeholder="Buscar amigos..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div key={friendId} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {friendName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{friendName}</div>
                    <div className="text-sm text-gray-500">@{friendUsername}</div>
                  </div>
                </div>
                
                {/* Friend since date */}
                {friend.friendSince && (
                  <div className="text-xs text-gray-400 mb-3">
                    Amigos desde {new Date(friend.friendSince).toLocaleDateString()}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.location.href = `/${friendUsername}`}
                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ver Perfil
                  </button>
                  <button 
                    onClick={() => window.location.href = `/${friendUsername}`}
                    className="flex-1 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ver Diario
                  </button>
                </div>

                {/* Mutual friends indicator (if available) */}
                {friend.mutualFriendsCount && friend.mutualFriendsCount > 0 && (
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    {friend.mutualFriendsCount} amigo{friend.mutualFriendsCount !== 1 ? 's' : ''} en común
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          {searchTerm ? (
            // No search results
            <div className="text-gray-500">
              <div className="text-4xl mb-2">🔍</div>
              <p>No se encontraron amigos con &ldquo;{searchTerm}&rdquo;</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            // No friends at all
            <div className="text-gray-500">
              <div className="text-4xl mb-2">👫</div>
              <p>
                {isOwnProfile 
                  ? 'Aún no tienes amigos. ¡Envía algunas solicitudes de amistad!'
                  : `@${username} aún no tiene amigos públicos.`
                }
              </p>
              {isOwnProfile && (
                <p className="text-sm mt-2 text-gray-400">
                  Ve a &ldquo;Solicitudes de Amistad&rdquo; para conectar con otros usuarios.
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Friends count summary */}
      {friends.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <div className="text-sm text-gray-600">
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
    </div>
  );
}
