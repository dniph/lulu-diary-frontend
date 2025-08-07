'use client';

import { useState, useEffect } from 'react';

export default function FollowSystem({ username, currentUserId = 1, isOwnProfile = false }) {
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  // Load followers and following data
  useEffect(() => {
    const fetchFollowData = async () => {
      try {
        setLoading(true);
        
        // Fetch followers
        const followersRes = await fetch(`/api/lulu-diary/profiles/${username}/followers`);
        if (followersRes.ok) {
          const followersData = await followersRes.json();
          setFollowers(followersData);
          
          // Check if current user is following this profile
          if (!isOwnProfile && currentUserId) {
            const isCurrentUserFollowing = followersData.some(follower => follower.followerId === currentUserId);
            setIsFollowing(isCurrentUserFollowing);
          }
        }
        
        // Fetch following
        const followingRes = await fetch(`/api/lulu-diary/profiles/${username}/following`);
        if (followingRes.ok) {
          const followingData = await followingRes.json();
          setFollowing(followingData);
        }
      } catch (error) {
        console.error('Error fetching follow data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowData();
  }, [username, currentUserId, isOwnProfile]);

  // Handle follow action
  const handleFollow = async () => {
    if (actionLoading || isOwnProfile) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/lulu-diary/profiles/${username}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Error al seguir el perfil');
      
      // Add current user to followers list
      const newFollower = {
        followerId: currentUserId,
        followerName: `Usuario ${currentUserId}`, // This would come from user context in real app
        followedAt: new Date().toISOString()
      };
      
      setFollowers(prev => [...prev, newFollower]);
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following profile:', error);
      alert('Error al seguir el perfil.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async () => {
    if (actionLoading || isOwnProfile) return;
    
    setActionLoading(true);
    try {
      const res = await fetch(`/api/lulu-diary/profiles/${username}/unfollow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Error al dejar de seguir el perfil');
      
      // Remove current user from followers list
      setFollowers(prev => prev.filter(follower => follower.followerId !== currentUserId));
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing profile:', error);
      alert('Error al dejar de seguir el perfil.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-500">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Follow Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowFollowers(!showFollowers)}
            className="text-center hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="text-xl font-bold text-gray-900">{followers.length}</div>
            <div className="text-sm text-gray-600">Seguidores</div>
          </button>
          
          <button
            onClick={() => setShowFollowing(!showFollowing)}
            className="text-center hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="text-xl font-bold text-gray-900">{following.length}</div>
            <div className="text-sm text-gray-600">Siguiendo</div>
          </button>
        </div>

        {/* Follow/Unfollow Button */}
        {!isOwnProfile && (
          <button
            onClick={isFollowing ? handleUnfollow : handleFollow}
            disabled={actionLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isFollowing
                ? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {actionLoading ? (
              <div className="flex items-center gap-2">
                <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
                <span>{isFollowing ? 'Dejando...' : 'Siguiendo...'}</span>
              </div>
            ) : (
              <span>{isFollowing ? 'Siguiendo' : 'Seguir'}</span>
            )}
          </button>
        )}
      </div>

      {/* Followers List */}
      {showFollowers && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Seguidores ({followers.length})</h3>
          {followers.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {followers.map((follower) => (
                <div key={follower.followerId} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(follower.followerName || `Usuario ${follower.followerId}`).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {follower.followerName || `Usuario ${follower.followerId}`}
                      </div>
                      {follower.followedAt && (
                        <div className="text-xs text-gray-500">
                          Desde {new Date(follower.followedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver perfil
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Sin seguidores aún</p>
          )}
        </div>
      )}

      {/* Following List */}
      {showFollowing && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Siguiendo ({following.length})</h3>
          {following.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {following.map((followed) => (
                <div key={followed.followedId || followed.profileId} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {(followed.followedName || followed.profileName || `Usuario ${followed.followedId || followed.profileId}`).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {followed.followedName || followed.profileName || `Usuario ${followed.followedId || followed.profileId}`}
                      </div>
                      {followed.followedAt && (
                        <div className="text-xs text-gray-500">
                          Desde {new Date(followed.followedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Ver perfil
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No sigue a nadie aún</p>
          )}
        </div>
      )}
    </div>
  );
}
