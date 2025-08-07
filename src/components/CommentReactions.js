'use client';

import { useState, useEffect } from 'react';

export default function CommentReactions({ username, diaryId, commentId, currentUser = null, currentUserId = 1 }) {
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState(false);

  // Available reaction types with emojis (same as diary reactions)
  const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Me gusta' },
    { type: 'love', emoji: '❤️', label: 'Me encanta' },
    { type: 'laugh', emoji: '😄', label: 'Divertido' },
    { type: 'sad', emoji: '😢', label: 'Triste' },
    { type: 'angry', emoji: '😠', label: 'Enojado' },
    { type: 'surprised', emoji: '😮', label: 'Sorprendido' }
  ];

  // Reset reactions when commentId changes
  useEffect(() => {
    setReactions([]);
    setUserReaction(null);
    setLoading(true);
  }, [commentId]);

  // Load reactions on component mount or when commentId changes
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/lulu-diary/profiles/${username}/diaries/${diaryId}/comments/${commentId}/reactions`);
        if (!res.ok) throw new Error('Error al obtener reacciones del comentario');
        const data = await res.json();
        
        setReactions(data);
        
        // Find current user's reaction if exists
        if (currentUserId) {
          const currentUserReaction = data.find(reaction => reaction.profileId === currentUserId);
          setUserReaction(currentUserReaction?.reactionType || null);
        }
      } catch (error) {
        console.error('Error fetching comment reactions:', error);
        setReactions([]);
        setUserReaction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReactions();
  }, [username, diaryId, commentId, currentUser, currentUserId]);

  // Handle adding or changing a reaction
  const handleReact = async (reactionType) => {
    if (reacting) return;
    setReacting(true);

    try {
      const res = await fetch(`/api/lulu-diary/profiles/${username}/diaries/${diaryId}/comments/${commentId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reactionType: reactionType
        }),
      });

      if (!res.ok) throw new Error('Error al reaccionar al comentario');
      
      const newReaction = await res.json();
      
      // Update reactions list
      setReactions(prev => {
        // Remove any existing reaction from this user
        const filtered = prev.filter(r => r.profileId !== currentUserId);
        // Add the new reaction
        return [...filtered, newReaction];
      });
      
      setUserReaction(reactionType);
    } catch (error) {
      console.error('Error adding comment reaction:', error);
      alert('Error al reaccionar al comentario.');
    } finally {
      setReacting(false);
    }
  };

  // Handle removing a reaction
  const handleUnreact = async () => {
    if (!userReaction) return;
    
    if (reacting) return;
    setReacting(true);

    try {
      const res = await fetch(`/api/lulu-diary/profiles/${username}/diaries/${diaryId}/comments/${commentId}/unreact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) throw new Error('Error al quitar reacción del comentario');
      
      // Update reactions list - remove user's reaction
      setReactions(prev => prev.filter(r => r.profileId !== currentUserId));
      setUserReaction(null);
    } catch (error) {
      console.error('Error removing comment reaction:', error);
      alert('Error al quitar la reacción del comentario.');
    } finally {
      setReacting(false);
    }
  };

  // Group reactions by type and count them
  const groupedReactions = reactionTypes.map(reactionType => {
    const count = reactions.filter(r => r.reactionType === reactionType.type).length;
    return {
      ...reactionType,
      count,
      hasReacted: userReaction === reactionType.type
    };
  }).filter(r => r.count > 0 || r.hasReacted);

  // Get total reactions count
  const totalReactions = reactions.length;

  if (loading) {
    return (
      <div className="mt-2 flex items-center justify-center py-1">
        <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
        <span className="ml-1 text-xs text-gray-400">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {/* Reactions Summary - More compact for comments */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5">
            {groupedReactions.slice(0, 3).map(reaction => (
              <span key={reaction.type} className="text-xs">
                {reaction.emoji}
              </span>
            ))}
            {groupedReactions.length > 3 && (
              <span className="text-xs text-gray-400">+{groupedReactions.length - 3}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {totalReactions}
          </span>
        </div>
      )}

      {/* Reaction Buttons - All reactions at the same level */}
      <div className="flex items-center gap-1 flex-wrap">
        {reactionTypes.map(reactionType => { // Show all reactions
          const reactionData = groupedReactions.find(r => r.type === reactionType.type);
          const isActive = userReaction === reactionType.type;
          const count = reactionData?.count || 0;

          return (
            <button
              key={reactionType.type}
              onClick={() => isActive ? handleUnreact() : handleReact(reactionType.type)}
              disabled={reacting}
              className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
              } ${reacting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
              title={reactionType.label}
            >
              <span className={`text-xs ${isActive ? 'scale-105' : ''} transition-transform`}>
                {reactionType.emoji}
              </span>
              {count > 0 && (
                <span className={`text-xs ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reactions Detail (when there are reactions) */}
      {totalReactions > 0 && (
        <div className="mt-2 pt-1 border-t border-gray-50">
          <details className="group">
            <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
              Ver quién reaccionó ▼
            </summary>
            <div className="mt-1 space-y-0.5 max-h-24 overflow-y-auto">
              {groupedReactions.map(reactionType => {
                // Get users who reacted with this type
                const usersWithReaction = reactions.filter(r => r.reactionType === reactionType.type);
                
                return (
                  <div key={reactionType.type} className="text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <span>{reactionType.emoji}</span>
                      <span className="font-medium">{reactionType.label}:</span>
                      <span>
                        {usersWithReaction.map((reaction, index) => (
                          <span key={reaction.profileId}>
                            {reaction.profileName || `Usuario ${reaction.profileId}`}
                            {index < usersWithReaction.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
