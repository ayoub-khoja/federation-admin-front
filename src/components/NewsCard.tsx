"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { News } from '../services/newsService';
import adminApi from '../services/adminApi';

interface NewsCardProps {
  news: News;
  onDelete: (id: number) => void;
  onEdit: (news: News) => void;
  language: 'fr' | 'ar';
}

export const NewsCard: React.FC<NewsCardProps> = ({ 
  news, 
  onDelete, 
  onEdit, 
  language = 'fr' 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const title = language === 'ar' ? news.title_ar : news.title_fr;
  const content = language === 'ar' ? news.content_ar : news.content_fr;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (text: string, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDelete = () => {
    onDelete(news.id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group animate-fadeInUp">
      {/* Header de la carte */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {news.is_featured && (
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                ⭐ À la une
              </span>
            )}
            {!news.is_published && (
              <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30">
                📝 Brouillon
              </span>
            )}
            {news.has_media && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                {news.media_type === 'image' ? '🖼️' : '🎥'} Média
              </span>
            )}
          </div>
          <h3 className={`text-lg font-bold text-white group-hover:text-white/90 transition-colors ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {title || (language === 'ar' ? 'Titre manquant' : 'Titre manquant')}
          </h3>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(news)}
            className="p-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-all duration-200 border border-blue-500/30"
            title="Modifier"
          >
            ✏️
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-all duration-200 border border-red-500/30"
            title="Supprimer"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Média */}
      {news.has_media && (
        <div className="mb-4">
          {news.media_type === 'image' && news.image && (
            <div className="relative">
              <Image
                src={adminApi.getMediaURL(news.image)}
                alt={title}
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg border border-white/10"
                onError={() => {
                  console.error('Erreur de chargement de l\'image:', news.image);
                }}
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-white text-xs flex items-center space-x-1">
                  <span>🖼️</span>
                  <span>Image</span>
                </span>
              </div>
            </div>
          )}
          {news.media_type === 'video' && news.video && (
            <div className="relative">
              <video
                src={adminApi.getMediaURL(news.video)}
                controls
                className="w-full h-48 object-cover rounded-lg border border-white/10"
                poster={news.image ? adminApi.getMediaURL(news.image) : undefined}
                onError={() => {
                  console.error('Erreur de chargement de la vidéo:', news.video);
                }}
              />
              <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-white text-xs flex items-center space-x-1">
                  <span>🎥</span>
                  <span>Vidéo</span>
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contenu */}
      <div className={`mb-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <p className="text-white/80 leading-relaxed">
          {isExpanded ? content : truncateContent(content || '')}
        </p>
        {content && content.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-300 hover:text-blue-200 text-sm mt-2 transition-colors"
          >
            {isExpanded ? 'Voir moins' : 'Voir plus'}
          </button>
        )}
      </div>

      {/* Footer de la carte */}
      <div className="flex justify-between items-center text-sm text-white/60 border-t border-white/10 pt-4">
        <div className="flex items-center space-x-2">
          <span>👤</span>
          <span>{news.author_name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>📅</span>
          <span>{formatDate(news.created_at)}</span>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4">🗑️ Confirmer la suppression</h3>
            <p className="text-white/80 mb-6">
              Êtes-vous sûr de vouloir supprimer cette actualité ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500/20 backdrop-blur-sm text-red-300 rounded-lg hover:bg-red-500/30 transition-all duration-300 border border-red-500/30"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
