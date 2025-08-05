'use client';

import { useState, useEffect } from 'react';
import CommentReactions from './CommentReactions';

export default function Comments({ username, diaryId, currentUser = null, currentUserId = 1 }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  // Reset comments when diaryId changes
  useEffect(() => {
    setComments([]);
    setCommentsCount(0);
    setShowComments(false);
    setLoading(true);
  }, [diaryId]);

  // Load comments count on component mount
  useEffect(() => {
    const fetchCommentsCount = async () => {
      try {
        const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries/${diaryId}/comments`);
        if (!res.ok) throw new Error('Error al obtener comentarios');
        const data = await res.json();
        setCommentsCount(data.length);
      } catch (error) {
        console.error('Error fetching comments count:', error);
        setCommentsCount(0);
      }
    };

    fetchCommentsCount();
  }, [username, diaryId]);

  // Load full comments when expanding
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries/${diaryId}/comments`);
        if (!res.ok) throw new Error('Error al obtener comentarios');
        const data = await res.json();
        setComments(data);
        setCommentsCount(data.length); // Update count when loading full comments
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    if (showComments) {
      fetchComments();
    }
  }, [showComments, username, diaryId]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries/${diaryId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: Add authentication headers when auth is implemented
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newComment.trim(),
          // TODO: Get author from authenticated user
          author: currentUser || 'usuario_anonimo'
        }),
      });

      if (!res.ok) throw new Error('Error al enviar comentario');
      
      const savedComment = await res.json();
      setComments(prev => [...prev, savedComment]);
      setCommentsCount(prev => prev + 1); // Update count
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Error al enviar el comentario. ¿Estás autenticado?');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('¿Eliminar este comentario?');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5180/api/profiles/${username}/diaries/${diaryId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          // TODO: Add authentication headers when auth is implemented
          // 'Authorization': `Bearer ${token}`
        },
      });

      if (!res.ok) throw new Error('Error al eliminar comentario');
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setCommentsCount(prev => prev - 1); // Update count
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error al eliminar el comentario. Solo puedes eliminar tus propios comentarios.');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      {/* Comments Toggle Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
      >
        <span className="text-lg">💬</span>
        <span className="font-medium">
          {showComments ? 'Ocultar comentarios' : `Ver comentarios (${commentsCount})`}
        </span>
        <span className={`transform transition-transform ${showComments ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-4">
          {/* New Comment Form */}
          <form onSubmit={handleSubmitComment} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {(currentUser || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  disabled={submitting}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-500">
                    {currentUser ? `Comentando como ${currentUser}` : 'Comentario anónimo'}
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {submitting ? 'Enviando...' : '💬 Comentar'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          {loading ? (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-2">Cargando comentarios...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">💭</span>
              <p>No hay comentarios aún</p>
              <p className="text-sm">¡Sé el primero en comentar!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {(comment.author || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm">
                            {comment.author || 'Usuario anónimo'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        {/* Delete button - TODO: Only show for comment author or diary owner */}
                        {(currentUser === comment.author || currentUser === username) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            title="Eliminar comentario"
                          >
                            <span className="text-sm">🗑️</span>
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed break-words">
                        {comment.content}
                      </p>
                      {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                        <p className="text-xs text-gray-400 mt-1 italic">
                          Editado el {formatDate(comment.updatedAt)}
                        </p>
                      )}
                      
                      {/* Comment Reactions */}
                      <CommentReactions 
                        username={username}
                        diaryId={diaryId}
                        commentId={comment.id}
                        currentUser={currentUser}
                        currentUserId={currentUserId}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
