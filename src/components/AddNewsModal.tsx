"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useToast } from '../hooks/useToast';
import { useLoading } from '../hooks/useLoading';
import { ButtonLoader } from './ui';
import { newsService, NewsCreateData } from '../services/newsService';

interface AddNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddNewsModal: React.FC<AddNewsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<NewsCreateData>({
    title_fr: '',
    title_ar: '',
    content_fr: '',
    content_ar: '',
    is_published: true,
    is_featured: false,
    order: 0
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);

  const { showSuccess, showError } = useToast();
  const { setLoading, isLoading } = useLoading();

  const handleInputChange = (field: keyof NewsCreateData, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file, video: undefined }));
      setPreviewImage(URL.createObjectURL(file));
      setPreviewVideo(null);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, video: file, image: undefined }));
      setPreviewVideo(URL.createObjectURL(file));
      setPreviewImage(null);
    }
  };

  const removeMedia = () => {
    setFormData(prev => ({ ...prev, image: undefined, video: undefined }));
    setPreviewImage(null);
    setPreviewVideo(null);
  };

  const resetForm = () => {
    setFormData({
      title_fr: '',
      title_ar: '',
      content_fr: '',
      content_ar: '',
      image: undefined,
      video: undefined,
      is_published: true,
      is_featured: false,
      order: 0
    });
    setPreviewImage(null);
    setPreviewVideo(null);
    
    // Reset les inputs de fichiers
    const imageInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
    const videoInput = document.querySelector('input[type="file"][accept="video/*"]') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
    if (videoInput) videoInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title_fr && !formData.title_ar) {
      showError('Au moins un titre (français ou arabe) est requis');
      return;
    }
    
    if (!formData.content_fr && !formData.content_ar) {
      showError('Au moins un contenu (français ou arabe) est requis');
      return;
    }

    setLoading('create-news', true);

    try {
      const result = await newsService.createNews(formData);
      showSuccess(result.message);
      resetForm();
      onSuccess();
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Erreur lors de la création');
    } finally {
      setLoading('create-news', false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">📰 Ajouter une Actualité</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                🇫🇷 Titre en Français
              </label>
              <input
                type="text"
                value={formData.title_fr}
                onChange={(e) => handleInputChange('title_fr', e.target.value)}
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
                onChange={(e) => handleInputChange('title_ar', e.target.value)}
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
                onChange={(e) => handleInputChange('content_fr', e.target.value)}
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
                onChange={(e) => handleInputChange('content_ar', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white placeholder-white/60 resize-none"
                placeholder="المحتوى المفصل بالعربية..."
                dir="rtl"
              />
            </div>
          </div>

          {/* Section Médias */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">📁 Médias (Optionnel)</h3>
              {(previewImage || previewVideo) && (
                <button
                  type="button"
                  onClick={removeMedia}
                  className="text-red-300 hover:text-red-200 text-sm transition-colors flex items-center space-x-1"
                >
                  <span>🗑️</span>
                  <span>Supprimer le média</span>
                </button>
              )}
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-white/60 text-sm mb-3">
                ℹ️ Vous pouvez ajouter une image <strong>ou</strong> une vidéo (pas les deux)
              </p>
              
              {/* Affichage du média sélectionné */}
              {previewImage && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm">🖼️ Image sélectionnée :</span>
                    <span className="text-green-300 text-sm">✅ Prêt</span>
                  </div>
                  <div className="relative">
                    <Image
                      src={previewImage}
                      alt="Aperçu de l'image"
                      width={200}
                      height={150}
                      className="w-full h-48 object-cover rounded-lg border border-white/20"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-white text-xs">🖼️ Image</span>
                    </div>
                  </div>
                </div>
              )}
              
              {previewVideo && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80 text-sm">🎥 Vidéo sélectionnée :</span>
                    <span className="text-green-300 text-sm">✅ Prêt</span>
                  </div>
                  <div className="relative">
                    <video
                      src={previewVideo}
                      controls
                      className="w-full h-48 object-cover rounded-lg border border-white/20"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                      <span className="text-white text-xs">🎥 Vidéo</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Boutons de sélection */}
              {!previewImage && !previewVideo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      🖼️ Choisir une Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/90 mb-2">
                      🎥 Choisir une Vidéo
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-white/10 file:text-white"
                    />
                  </div>
                </div>
              )}
              
              {/* Option pour changer le média */}
              {(previewImage || previewVideo) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      🔄 Changer pour une Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors text-white text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-white/10 file:text-white file:text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      🔄 Changer pour une Vidéo
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg focus:border-white/40 focus:outline-none transition-colors text-white text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-white/10 file:text-white file:text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_published"
                checked={formData.is_published}
                onChange={(e) => handleInputChange('is_published', e.target.checked)}
                className="w-5 h-5 text-white bg-white/20 border-white/30 rounded focus:ring-white/50"
              />
              <label htmlFor="is_published" className="text-white/90">
                ✅ Publier immédiatement
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                className="w-5 h-5 text-white bg-white/20 border-white/30 rounded focus:ring-white/50"
              />
              <label htmlFor="is_featured" className="text-white/90">
                ⭐ Mettre à la une
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                📊 Ordre d&apos;affichage
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:border-white/50 focus:outline-none transition-colors text-white"
                min="0"
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
              disabled={isLoading('create-news')}
              className="px-6 py-3 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-lg hover:bg-green-500/30 transition-all duration-300 border border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading('create-news') ? (
                <>
                  <ButtonLoader size="small" />
                  <span>Création...</span>
                </>
              ) : (
                <>
                  <span>📰</span>
                  <span>Créer l&apos;Actualité</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
