'use client';

import { useState, useEffect } from 'react';

export default function DiaryReactions({ username, diaryId, currentUser = null, currentUserId = 1 }) {
  const [reactions, setReactions] = useState([]);
  const [userReaction, setUserReaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reacting, setReacting] = useState(false);

  // Available reaction types with emojis
  const reactionTypes = [
    { type: 'like', emoji: '👍', label: 'Like' },
    { type: 'love', emoji: '❤️', label: 'Love' },
    { type: 'laugh', emoji: '😄', label: 'Funny' },
    { type: 'sad', emoji: '😢', label: 'Sad' },
    { type: 'angry', emoji: '😠', label: 'Angry' },
    { type: 'surprised', emoji: '😮', label: 'Surprised' }
  ];

  // Reset reactions when diaryId changes
  useEffect(() => {
    setReactions([]);
    setUserReaction(null);
    setLoading(true);
  }, [diaryId]);

  // Load reactions on component mount or when diaryId changes
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/lulu-diary/profiles/${username}/diaries/${diaryId}/reactions`);
        if (!res.ok) throw new Error('Error getting reactions');
        const data = await res.json();
        
        setReactions(data);
        
        // Find current user's reaction if exists
        if (currentUserId) {
          const currentUserReaction = data.find(reaction => reaction.profileId === currentUserId);
          setUserReaction(currentUserReaction?.reactionType || null);
        }
      } catch (error) {
        console.error('Error fetching reactions:', error);
        setReactions([]);
        setUserReaction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReactions();
  }, [username, diaryId, currentUser, currentUserId]);

  // Handle adding or changing a reaction
  const handleReact = async (reactionType) => {
    if (reacting) return;
    setReacting(true);

    try {
      const res = await fetch(`/api/lulu-diary/profiles/${username}/diaries/${diaryId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reactionType: reactionType
        }),
      });

      if (!res.ok) throw new Error('Error adding reaction');
      
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
      console.error('Error adding reaction:', error);
      alert('Error adding reaction.');
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
      const res = await fetch(`/api/lulu-diary/profiles/${username}/diaries/${diaryId}/unreact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) throw new Error('Error removing reaction');
      
      // Update reactions list - remove user's reaction
      setReactions(prev => prev.filter(r => r.profileId !== currentUserId));
      setUserReaction(null);
    } catch (error) {
      console.error('Error removing reaction:', error);
      alert('Error removing reaction.');
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
      <div className="mt-4 flex items-center justify-center py-2">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
  <span className="ml-2 text-sm text-gray-500">Loading reactions...</span>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t border-gray-100 pt-4">
      {/* Reactions Summary */}
      {totalReactions > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {groupedReactions.slice(0, 3).map(reaction => (
              <span key={reaction.type} className="text-sm">
                {reaction.emoji}
              </span>
            ))}
            {groupedReactions.length > 3 && (
              <span className="text-xs text-gray-500">+{groupedReactions.length - 3}</span>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
          </span>
        </div>
      )}

      {/* Reaction Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {reactionTypes.map(reactionType => {
          const reactionData = groupedReactions.find(r => r.type === reactionType.type);
          const isActive = userReaction === reactionType.type;
          const count = reactionData?.count || 0;

          return (
            <button
              key={reactionType.type}
              onClick={() => isActive ? handleUnreact() : handleReact(reactionType.type)}
              disabled={reacting}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-sm'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
              } ${reacting ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
              title={reactionType.label}
            >
              <span className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                {reactionType.emoji}
              </span>
              {count > 0 && (
                <span className={`text-xs ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Reactions Detail (when there are reactions) */}
      {totalReactions > 0 && (
        <div className="mt-3 pt-2 border-t border-gray-50">
          <details className="group">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
              See who reacted ▼
            </summary>
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {groupedReactions.map(reactionType => (
                <div key={reactionType.type} className="text-xs text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <span>{reactionType.emoji}</span>
                    <span className="font-medium">{reactionType.label}:</span>
                    <span>{reactionType.count} {reactionType.count === 1 ? 'person' : 'people'}</span>
                  </span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Empty state message */}
      {totalReactions === 0 && !loading && (
        <p className="text-xs text-gray-400 text-center py-2">
          Be the first to react to this entry!
        </p>
      )}
    </div>
  );
}
