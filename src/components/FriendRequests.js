'use client';

import { useState, useEffect } from 'react';

export default function FriendRequests({ currentUserId = 1 }) {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState('incoming');

  // Load friend requests on component mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        
        // Fetch incoming requests
        const incomingRes = await fetch('/api/lulu-diary/friend-requests/incoming', {
          headers: {
            'X-Current-User-Id': currentUserId.toString(),
            'Content-Type': 'application/json'
          }
        });
        if (incomingRes.ok) {
          const incomingData = await incomingRes.json();
          setIncomingRequests(incomingData);
        }
        
        // Fetch outgoing requests
        const outgoingRes = await fetch('/api/lulu-diary/friend-requests/outgoing', {
          headers: {
            'X-Current-User-Id': currentUserId.toString(),
            'Content-Type': 'application/json'
          }
        });
        if (outgoingRes.ok) {
          const outgoingData = await outgoingRes.json();
          setOutgoingRequests(outgoingData);
        }
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [currentUserId]);

  // Handle sending a friend request
  const handleSendRequest = async (username) => {
    if (actionLoading[`send-${username}`]) return;
    
    setActionLoading(prev => ({ ...prev, [`send-${username}`]: true }));
    try {
      const res = await fetch('/api/lulu-diary/friend-requests/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Current-User-Id': currentUserId.toString()
        },
        body: JSON.stringify({ requestedUsername: username }),
      });

      if (!res.ok) throw new Error('Error al enviar solicitud de amistad');
      
      const newRequest = await res.json();
      setOutgoingRequests(prev => [...prev, newRequest]);
      alert('Solicitud de amistad enviada!');
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Error al enviar la solicitud de amistad.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`send-${username}`]: false }));
    }
  };

  // Handle accepting a friend request
  const handleAcceptRequest = async (requestId) => {
    if (actionLoading[`accept-${requestId}`]) return;
    
    setActionLoading(prev => ({ ...prev, [`accept-${requestId}`]: true }));
    try {
      const res = await fetch(`/api/lulu-diary/friend-requests/accept/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Current-User-Id': currentUserId.toString()
        },
      });

      if (!res.ok) throw new Error('Error al aceptar solicitud de amistad');
      
      // Remove from incoming requests
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      alert('Solicitud de amistad aceptada!');
    } catch (error) {
      console.error('Error accepting friend request:', error);
      alert('Error al aceptar la solicitud de amistad.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`accept-${requestId}`]: false }));
    }
  };

  // Handle rejecting a friend request
  const handleRejectRequest = async (requestId) => {
    if (actionLoading[`reject-${requestId}`]) return;
    
    setActionLoading(prev => ({ ...prev, [`reject-${requestId}`]: true }));
    try {
      const res = await fetch(`/api/lulu-diary/friend-requests/reject/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Current-User-Id': currentUserId.toString()
        },
      });

      if (!res.ok) throw new Error('Error al rechazar solicitud de amistad');
      
      // Remove from incoming requests
      setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
      alert('Solicitud de amistad rechazada.');
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      alert('Error al rechazar la solicitud de amistad.');
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject-${requestId}`]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 font-pixel">
        <div className="bg-yellow-100 rounded-lg border-4 border-orange-500 shadow-2xl p-6 flex flex-col items-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-4 border-pink-500 mb-2"></div>
          <span className="text-pink-700 font-bold text-lg">Loading requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 rounded-lg border-4 border-yellow-500 shadow-lg p-6 font-pixel relative overflow-hidden">
      {/* Decorative border */}
      <div className="absolute inset-0 border-4 border-yellow-300 rounded-lg m-2 pointer-events-none"></div>
      <h2 className="text-2xl font-bold text-yellow-800 uppercase tracking-wider flex items-center gap-2 mb-4">
        <span>📮</span> Friend Requests
      </h2>
      {/* Tabs */}
      <div className="flex border-b-4 border-yellow-300 mb-4 gap-2">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-6 py-2 text-center font-bold uppercase tracking-wider rounded-t-lg border-4 transition-all duration-200 shadow-md text-xs md:text-sm ${
            activeTab === 'incoming'
              ? 'bg-pink-200 border-pink-500 text-pink-900 scale-105'
              : 'bg-white border-yellow-300 text-yellow-700 hover:bg-pink-100 hover:border-pink-400 hover:text-pink-700'
          }`}
        >
          Incoming ({incomingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-6 py-2 text-center font-bold uppercase tracking-wider rounded-t-lg border-4 transition-all duration-200 shadow-md text-xs md:text-sm ${
            activeTab === 'outgoing'
              ? 'bg-cyan-200 border-cyan-500 text-cyan-900 scale-105'
              : 'bg-white border-yellow-300 text-yellow-700 hover:bg-cyan-100 hover:border-cyan-400 hover:text-cyan-700'
          }`}
        >
          Outgoing ({outgoingRequests.length})
        </button>
      </div>

      {/* Incoming Requests Tab */}
      {activeTab === 'incoming' && (
        <div className="space-y-3">
          {incomingRequests.length > 0 ? (
            incomingRequests.map((item) => {
              const { request, profile } = item;
              return (
                <div key={request.id} className="flex items-center justify-between p-4 bg-pink-50 rounded-lg border-4 border-pink-300 shadow-md relative overflow-hidden">
                  {/* Decorative border */}
                  <div className="absolute inset-0 border-2 border-pink-200 rounded-lg m-1 pointer-events-none"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold border-2 border-pink-300 shadow">
                      {(profile.displayName || profile.username || `User ${profile.id}`).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-pink-900 text-lg">
                        {profile.displayName || profile.username || `User ${profile.id}`}
                      </div>
                      <div className="text-xs text-pink-600 font-mono">
                        @{profile.username || `user${profile.id}`}
                      </div>
                      {request.createdAt && (
                        <div className="text-xs text-pink-400">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      disabled={actionLoading[`accept-${request.id}`]}
                      className="px-3 py-1.5 bg-green-400 text-white text-xs font-bold rounded-lg border-2 border-green-600 hover:bg-green-500 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[`accept-${request.id}`] ? (
                        <div className="flex items-center gap-1">
                          <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>...</span>
                        </div>
                      ) : (
                        'Accept'
                      )}
                    </button>
                    <button
                      onClick={() => handleRejectRequest(request.id)}
                      disabled={actionLoading[`reject-${request.id}`]}
                      className="px-3 py-1.5 bg-red-400 text-white text-xs font-bold rounded-lg border-2 border-red-600 hover:bg-red-500 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading[`reject-${request.id}`] ? (
                        <div className="flex items-center gap-1">
                          <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>...</span>
                        </div>
                      ) : (
                        'Reject'
                      )}
                    </button>
                  </div>
                  {/* Kawaii-style corner decorations */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-pink-400 border-r-2 border-b-2 border-pink-700"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-pink-400 border-l-2 border-b-2 border-pink-700"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-pink-400 border-r-2 border-t-2 border-pink-700"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-400 border-l-2 border-t-2 border-pink-700"></div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-pink-500 font-pixel">
              <div className="text-5xl mb-2">👥</div>
              <p className="font-bold">You have no pending friend requests</p>
            </div>
          )}
        </div>
      )}

      {/* Outgoing Requests Tab */}
      {activeTab === 'outgoing' && (
        <div className="space-y-3">
          {outgoingRequests.length > 0 ? (
            outgoingRequests.map((item) => {
              const { request, profile } = item;
              return (
                <div key={request.id} className="flex items-center justify-between p-4 bg-cyan-50 rounded-lg border-4 border-cyan-300 shadow-md relative overflow-hidden">
                  {/* Decorative border */}
                  <div className="absolute inset-0 border-2 border-cyan-200 rounded-lg m-1 pointer-events-none"></div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-yellow-400 rounded-full flex items-center justify-center text-white font-bold border-2 border-cyan-300 shadow">
                      {(profile.displayName || profile.username || `User ${profile.id}`).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-cyan-900 text-lg">
                        {profile.displayName || profile.username || `User ${profile.id}`}
                      </div>
                      <div className="text-xs text-cyan-600 font-mono">
                        @{profile.username || `user${profile.id}`}
                      </div>
                      {request.createdAt && (
                        <div className="text-xs text-cyan-400">
                          Sent {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-yellow-600 font-bold">
                    Pending
                  </div>
                  {/* Kawaii-style corner decorations */}
                  <div className="absolute top-0 left-0 w-2 h-2 bg-cyan-400 border-r-2 border-b-2 border-cyan-700"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-cyan-400 border-l-2 border-b-2 border-cyan-700"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 bg-cyan-400 border-r-2 border-t-2 border-cyan-700"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400 border-l-2 border-t-2 border-cyan-700"></div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-cyan-500 font-pixel">
              <div className="text-5xl mb-2">📤</div>
              <p className="font-bold">You have not sent any friend requests</p>
            </div>
          )}
        </div>
      )}

      {/* Send Friend Request Form */}
      <div className="mt-6 pt-4 border-t-2 border-yellow-300">
        <SendFriendRequestForm onRequestSent={handleSendRequest} actionLoading={actionLoading} />
      </div>

      {/* Kawaii-style corner decorations */}
      <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-500 border-r-4 border-b-4 border-yellow-900"></div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-500 border-l-4 border-b-4 border-yellow-900"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-yellow-500 border-r-4 border-t-4 border-yellow-900"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 border-l-4 border-t-4 border-yellow-900"></div>
    </div>
  );
}

// Component for sending friend requests
function SendFriendRequestForm({ onRequestSent, actionLoading }) {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    onRequestSent(username.trim());
    setUsername('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 font-pixel">
      <h3 className="text-lg font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-2">
  <span>✨</span> Send Friend Request
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username (e.g. Varto)"
          className="flex-1 px-3 py-2 border-2 border-yellow-400 rounded-lg font-pixel text-yellow-700 bg-yellow-50 focus:ring-2 focus:ring-yellow-300 focus:border-yellow-500 placeholder-yellow-300"
          required
        />
        <button
          type="submit"
          disabled={!username.trim() || actionLoading[`send-${username}`]}
          className="px-4 py-2 bg-pink-400 text-white font-bold rounded-lg border-2 border-pink-600 hover:bg-pink-500 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading[`send-${username}`] ? (
            <div className="flex items-center gap-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Sending...</span>
            </div>
          ) : (
            'Send'
          )}
        </button>
      </div>
    </form>
  );
}
