"use client";

import React, { useState, useMemo } from 'react';
import { useLigues } from '../hooks/useLigues';
import adminApi from '../services/adminApi';

interface AddArbitreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (arbitreData: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    address: string;
    grade: string;
    ligue_id: number;
    birth_date: string;
    birth_place: string;
    password: string;
    password_confirm: string;
  }) => Promise<void>;
  isLoading: boolean;
}

// Grades avec mapping vers le backend
const GRADES = [
  { value: 'debutant', label: 'Débutant (Candidat)' },
  { value: 'regional', label: 'Régional (3ème/2ème Série)' },
  { value: 'national', label: 'National (1ère Série)' },
  { value: 'international', label: 'International (Fédérale)' }
];

export default function AddArbitreModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}: AddArbitreModalProps) {
  const { ligues } = useLigues();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    address: '',
    grade: '',
    ligue_id: 0,
    birth_date: '',
    birth_place: '',
    password: '',
    password_confirm: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [phoneVerificationStatus, setPhoneVerificationStatus] = useState<{
    isVerifying: boolean;
    isVerified: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | null;
  }>({
    isVerifying: false,
    isVerified: false,
    message: '',
    type: null
  });

  // Validation du mot de passe
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const labels = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Très bon'];
    const colors = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-blue-400', 'text-green-400'];
    
    return {
      score: Math.min(score, 4),
      label: labels[Math.min(score, 4)],
      color: colors[Math.min(score, 4)]
    };
  }, [formData.password]);

  // Vérifier si tous les champs sont valides
  const isFormValid = useMemo(() => {
    return (
      formData.first_name.trim() !== '' &&
      formData.last_name.trim() !== '' &&
      formData.phone_number.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.address.trim() !== '' &&
      formData.grade !== '' &&
      formData.ligue_id !== 0 &&
      formData.birth_date !== '' &&
      formData.birth_place.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.password_confirm.trim() !== '' &&
      formData.password === formData.password_confirm &&
      passwordStrength.score >= 3 && // Mot de passe au moins "Bon"
      phoneVerificationStatus.isVerified && // Le numéro doit être vérifié
      Object.keys(errors).length === 0
    );
  }, [formData, errors, passwordStrength.score, phoneVerificationStatus.isVerified]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: {[key: string]: string} = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
    if (!formData.phone_number.trim()) newErrors.phone_number = 'Le numéro de téléphone est requis';
    if (!phoneVerificationStatus.isVerified) newErrors.phone_number = 'Le numéro de téléphone doit être vérifié et disponible';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.password.trim()) newErrors.password = 'Le mot de passe est requis';
    if (formData.password !== formData.password_confirm) newErrors.password_confirm = 'Les mots de passe ne correspondent pas';
    if (passwordStrength.score < 3) newErrors.password = 'Le mot de passe doit être au moins "Bon"';
    if (!formData.grade) newErrors.grade = 'Le grade est requis';
    if (!formData.ligue_id) newErrors.ligue_id = 'La ligue est requise';
    if (!formData.birth_date) newErrors.birth_date = 'La date de naissance est requise';
    if (!formData.birth_place.trim()) newErrors.birth_place = 'Le lieu de naissance est requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      // Réinitialiser le formulaire
      setFormData({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: '',
        address: '',
        grade: '',
        ligue_id: 0,
        birth_date: '',
        birth_place: '',
        password: '',
        password_confirm: ''
      });
      setErrors({});
      setPhoneVerificationStatus({
        isVerifying: false,
        isVerified: false,
        message: '',
        type: null
      });
      onClose();
    } catch (error) {
      // L'erreur sera gérée par le composant parent
      console.error('Erreur lors de la création:', error);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Fonction pour vérifier le numéro de téléphone
  const verifyPhoneNumber = async (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 8) {
      setPhoneVerificationStatus({
        isVerifying: false,
        isVerified: false,
        message: '',
        type: null
      });
      return;
    }

    setPhoneVerificationStatus({
      isVerifying: true,
      isVerified: false,
      message: 'Vérification en cours...',
      type: 'info'
    });

    try {
      const response = await adminApi.verifyPhoneNumber(phoneNumber);
      
      if (response.success && !response.exists) {
        // Numéro disponible
        setPhoneVerificationStatus({
          isVerifying: false,
          isVerified: true,
          message: response.message || 'Numéro disponible',
          type: 'success'
        });
      } else if (response.success && response.exists) {
        // Numéro déjà utilisé
        setPhoneVerificationStatus({
          isVerifying: false,
          isVerified: false,
          message: response.message || 'Ce numéro est déjà utilisé',
          type: 'error'
        });
      } else {
        throw new Error(response.message || 'Erreur de vérification');
      }
    } catch (error) {
      setPhoneVerificationStatus({
        isVerifying: false,
        isVerified: false,
        message: error instanceof Error ? error.message : 'Erreur de vérification',
        type: 'error'
      });
    }
  };

  const handlePhoneChange = (value: string) => {
    // Auto-formater le numéro de téléphone comme dans le mobile
    let formattedValue = value.replace(/\D/g, ''); // Supprimer tous les non-chiffres
    
    if (formattedValue.length > 0 && !formattedValue.startsWith('216')) {
      if (formattedValue.length <= 8) {
        formattedValue = '216' + formattedValue;
      }
    }
    
    if (formattedValue.length > 11) {
      formattedValue = formattedValue.substring(0, 11);
    }
    
    const finalValue = formattedValue.length > 0 ? '+' + formattedValue : '';
    handleChange('phone_number', finalValue);
    
    // Réinitialiser le statut de vérification quand le numéro change
    setPhoneVerificationStatus({
      isVerifying: false,
      isVerified: false,
      message: '',
      type: null
    });
  };

  // Vérifier le numéro quand il est complet
  const handlePhoneBlur = () => {
    if (formData.phone_number && formData.phone_number.length >= 8) {
      verifyPhoneNumber(formData.phone_number);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">👤 Ajouter un Arbitre</h2>
          <button
            onClick={() => {
              setPhoneVerificationStatus({
                isVerifying: false,
                isVerified: false,
                message: '',
                type: null
              });
              onClose();
            }}
            className="text-white/80 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90 flex items-center">
              <span className="mr-2">👤</span>
              Informations Personnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 ${
                    errors.first_name ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  placeholder="Prénom"
                  disabled={isLoading}
                />
                {errors.first_name && (
                  <p className="text-red-300 text-xs mt-1">{errors.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 ${
                    errors.last_name ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  placeholder="Nom"
                  disabled={isLoading}
                />
                {errors.last_name && (
                  <p className="text-red-300 text-xs mt-1">{errors.last_name}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Numéro de téléphone *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone_number}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  onBlur={handlePhoneBlur}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 ${
                    errors.phone_number ? 'border-red-500/50' : 
                    phoneVerificationStatus.type === 'success' ? 'border-green-500/50' :
                    phoneVerificationStatus.type === 'error' ? 'border-red-500/50' :
                    'border-white/30 focus:border-white/50'
                  }`}
                  placeholder="+21612345678"
                  disabled={isLoading}
                />
                {phoneVerificationStatus.isVerifying && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  </div>
                )}
                {phoneVerificationStatus.type === 'success' && !phoneVerificationStatus.isVerifying && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-green-400 text-lg">✓</span>
                  </div>
                )}
                {phoneVerificationStatus.type === 'error' && !phoneVerificationStatus.isVerifying && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <span className="text-red-400 text-lg">✗</span>
                  </div>
                )}
              </div>
              
              {/* Messages de statut */}
              {phoneVerificationStatus.message && (
                <p className={`text-xs mt-1 ${
                  phoneVerificationStatus.type === 'success' ? 'text-green-300' :
                  phoneVerificationStatus.type === 'error' ? 'text-red-300' :
                  'text-blue-300'
                }`}>
                  {phoneVerificationStatus.message}
                </p>
              )}
              
              {errors.phone_number && (
                <p className="text-red-300 text-xs mt-1">{errors.phone_number}</p>
              )}
              
              <p className="text-white/60 text-xs mt-1">
                Format: +216XXXXXXXX (numéro tunisien) - Vérification automatique
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Adresse email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 ${
                  errors.email ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                }`}
                placeholder="email@example.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-red-300 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Adresse complète *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 resize-none ${
                  errors.address ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                }`}
                placeholder="Votre adresse complète (rue, ville, code postal)"
                disabled={isLoading}
              />
              {errors.address && (
                <p className="text-red-300 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Section 2: Informations professionnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90 flex items-center">
              <span className="mr-2">🏆</span>
              Informations Professionnelles
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Ligue d&apos;arbitrage *
                </label>
                <select
                  value={formData.ligue_id}
                  onChange={(e) => handleChange('ligue_id', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white ${
                    errors.ligue_id ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  disabled={isLoading}
                >
                  <option value="" className="text-gray-800">Sélectionnez une ligue</option>
                  {ligues.map((ligue) => (
                    <option key={ligue.id} value={ligue.id} className="text-gray-800">
                      {ligue.nom}
                    </option>
                  ))}
                </select>
                {errors.ligue_id && (
                  <p className="text-red-300 text-xs mt-1">{errors.ligue_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Grade d&apos;arbitrage *
                </label>
                <select
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white ${
                    errors.grade ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  disabled={isLoading}
                >
                  <option value="" className="text-gray-800">Sélectionnez un grade</option>
                  {GRADES.map((grade) => (
                    <option key={grade.value} value={grade.value} className="text-gray-800">
                      {grade.label}
                    </option>
                  ))}
                </select>
                {errors.grade && (
                  <p className="text-red-300 text-xs mt-1">{errors.grade}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Date de naissance *
                </label>
                <input
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white ${
                    errors.birth_date ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  disabled={isLoading}
                />
                {errors.birth_date && (
                  <p className="text-red-300 text-xs mt-1">{errors.birth_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Lieu de naissance *
                </label>
                <input
                  type="text"
                  value={formData.birth_place}
                  onChange={(e) => handleChange('birth_place', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 ${
                    errors.birth_place ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  placeholder="Ville ou lieu de naissance"
                  disabled={isLoading}
                />
                {errors.birth_place && (
                  <p className="text-red-300 text-xs mt-1">{errors.birth_place}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Sécurité */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white/90 flex items-center">
              <span className="mr-2">🔐</span>
              Sécurité du Compte
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 ${
                    errors.password ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  placeholder="Mot de passe"
                  disabled={isLoading}
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`${passwordStrength.color}`}>
                        Force: {passwordStrength.label}
                      </span>
                      <div className="flex space-x-1">
                        {[0, 1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`w-2 h-2 rounded-full ${
                              level <= passwordStrength.score ? passwordStrength.color.replace('text-', 'bg-') : 'bg-white/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  value={formData.password_confirm}
                  onChange={(e) => handleChange('password_confirm', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/20 backdrop-blur-sm border rounded-lg focus:outline-none transition-colors text-white placeholder-white/60 ${
                    errors.password_confirm ? 'border-red-500/50' : 'border-white/30 focus:border-white/50'
                  }`}
                  placeholder="Confirmer le mot de passe"
                  disabled={isLoading}
                />
                {errors.password_confirm && (
                  <p className="text-red-300 text-xs mt-1">{errors.password_confirm}</p>
                )}
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-white/20">
            <button
              type="button"
              onClick={() => {
                setPhoneVerificationStatus({
                  isVerifying: false,
                  isVerified: false,
                  message: '',
                  type: null
                });
                onClose();
              }}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                  <span>Création...</span>
                </>
              ) : (
                <>
                  <span>👤</span>
                  <span>Créer l&apos;arbitre</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
