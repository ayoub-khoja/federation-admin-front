"use client";

import React, { useState, useEffect } from 'react';

interface News {
  id: number;
  title_fr: string;
  title_ar: string;
  content_fr: string;
  content_ar: string;
}

interface EditNewsModalProps {
  isOpen: boolean;
  news: News | null;
  onClose: () => void;
  onSubmit: (data: {
    id: number;
    title_fr: string;
    title_ar: string;
    content_fr: string;
    content_ar: string;
  }) => Promise<void>;
}

export default function EditNewsModal({
  isOpen,
  news,
  onClose,
  onSubmit
}: EditNewsModalProps) {
  console.log('🔍 EditNewsModal render - isOpen:', isOpen, 'news:', news);
  const [formData, setFormData] = useState({
    title_fr: '',
    title_ar: '',
    content_fr: '',
    content_ar: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  // Mettre à jour le formulaire quand l'actualité change
  useEffect(() => {
    if (news) {
      setFormData({
        title_fr: news.title_fr || '',
        title_ar: news.title_ar || '',
        content_fr: news.content_fr || '',
        content_ar: news.content_ar || ''
      });
      setErrors({});
    }
  }, [news]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title_fr && !formData.title_ar) {
      setErrors({ general: 'Au moins un titre (français ou arabe) est requis' });
      return;
    }
    
    if (!formData.content_fr && !formData.content_ar) {
      setErrors({ general: 'Au moins un contenu (français ou arabe) est requis' });
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        id: news!.id,
        ...formData
      });
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !news) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">✏️ Modifier l&apos;Actualité</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Message d'erreur général */}
          {errors.general && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-lg p-4">
              <p className="text-red-300 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Titres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                🇫🇷 Titre en Français
              </label>
              <input
                type="text"
                value={formData.title_fr}
                onChange={(e) => handleChange('title_fr', e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/60"
                placeholder="Titre en français"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                🇹🇳 Titre en Arabe
              </label>
              <input
                type="text"
                value={formData.title_ar}
                onChange={(e) => handleChange('title_ar', e.target.value)}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/60"
                placeholder="العنوان بالعربية"
                dir="rtl"
              />
            </div>
          </div>

          {/* Contenus */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                📝 Contenu en Français
              </label>
              <textarea
                value={formData.content_fr}
                onChange={(e) => handleChange('content_fr', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/60 resize-none"
                placeholder="Contenu détaillé en français..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                📝 Contenu en Arabe
              </label>
              <textarea
                value={formData.content_ar}
                onChange={(e) => handleChange('content_ar', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/60 resize-none"
                placeholder="المحتوى المفصل بالعربية..."
                dir="rtl"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <span>⏳</span>
                  <span>Mise à jour...</span>
                </>
              ) : (
                <>
                  <span>✏️</span>
                  <span>Mettre à jour</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
