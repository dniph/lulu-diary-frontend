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
        const incomingRes = await fetch('http://localhost:5180/api/friend-requests/incoming', {
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
        const outgoingRes = await fetch('http://localhost:5180/api/friend-requests/outgoing', {
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
      const res = await fetch('http://localhost:5180/api/friend-requests/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Current-User-Id': currentUserId.toString()
        },
        body: JSON.stringify({ recipientUsername: username }),
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
      const res = await fetch(`http://localhost:5180/api/friend-requests/accept/${requestId}`, {
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
      const res = await fetch(`http://localhost:5180/api/friend-requests/reject/${requestId}`, {
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
      <div className="flex items-center justify-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-500">Cargando solicitudes...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Solicitudes de Amistad</h2>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'incoming'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Recibidas ({incomingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'outgoing'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Enviadas ({outgoingRequests.length})
        </button>
      </div>

      {/* Incoming Requests Tab */}
      {activeTab === 'incoming' && (
        <div className="space-y-3">
          {incomingRequests.length > 0 ? (
            incomingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {(request.senderName || `Usuario ${request.senderId}`).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {request.senderName || `Usuario ${request.senderId}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{request.senderUsername || `user${request.senderId}`}
                    </div>
                    {request.sentAt && (
                      <div className="text-xs text-gray-400">
                        {new Date(request.sentAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAcceptRequest(request.id)}
                    disabled={actionLoading[`accept-${request.id}`]}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading[`accept-${request.id}`] ? (
                      <div className="flex items-center gap-1">
                        <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        <span>...</span>
                      </div>
                    ) : (
                      'Aceptar'
                    )}
                  </button>
                  <button
                    onClick={() => handleRejectRequest(request.id)}
                    disabled={actionLoading[`reject-${request.id}`]}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading[`reject-${request.id}`] ? (
                      <div className="flex items-center gap-1">
                        <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        <span>...</span>
                      </div>
                    ) : (
                      'Rechazar'
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">👥</div>
              <p>No tienes solicitudes de amistad pendientes</p>
            </div>
          )}
        </div>
      )}

      {/* Outgoing Requests Tab */}
      {activeTab === 'outgoing' && (
        <div className="space-y-3">
          {outgoingRequests.length > 0 ? (
            outgoingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {(request.recipientName || `Usuario ${request.recipientId}`).charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {request.recipientName || `Usuario ${request.recipientId}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      @{request.recipientUsername || `user${request.recipientId}`}
                    </div>
                    {request.sentAt && (
                      <div className="text-xs text-gray-400">
                        Enviada {new Date(request.sentAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-yellow-600 font-medium">
                  Pendiente
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📤</div>
              <p>No has enviado solicitudes de amistad</p>
            </div>
          )}
        </div>
      )}

      {/* Send Friend Request Form */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <SendFriendRequestForm onRequestSent={handleSendRequest} actionLoading={actionLoading} />
      </div>
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Enviar Solicitud de Amistad</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario (ej: Varto)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        <button
          type="submit"
          disabled={!username.trim() || actionLoading[`send-${username}`]}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading[`send-${username}`] ? (
            <div className="flex items-center gap-2">
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Enviando...</span>
            </div>
          ) : (
            'Enviar'
          )}
        </button>
      </div>
    </form>
  );
}
