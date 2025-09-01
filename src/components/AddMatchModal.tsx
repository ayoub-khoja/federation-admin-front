"use client";

import React, { useState } from 'react';

interface AddMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (matchData: MatchData) => void;
}

interface MatchData {
  date: string;
  time: string;
  equipe1: string;
  equipe2: string;
  stade: string;
  arbitre_principal: string;
  assistant1: string;
  assistant2: string;
  quatrieme_arbitre: string;
  ligue: string;
}

const LIGUE_TYPES = [
  { value: 'ligue1', label: 'Ligue 1' },
  { value: 'ligue2', label: 'Ligue 2' },
  { value: 'c1', label: 'Coupe 1' },
  { value: 'c2', label: 'Coupe 2' },
  { value: 'jeunes', label: 'Jeunes' }
];

export default function AddMatchModal({ isOpen, onClose, onSubmit }: AddMatchModalProps) {
  const [formData, setFormData] = useState<MatchData>({
    date: '',
    time: '',
    equipe1: '',
    equipe2: '',
    stade: '',
    arbitre_principal: '',
    assistant1: '',
    assistant2: '',
    quatrieme_arbitre: '',
    ligue: ''
  });

  const [errors, setErrors] = useState<Partial<MatchData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Effacer l'erreur pour ce champ
    if (errors[name as keyof MatchData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<MatchData> = {};

    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.time) newErrors.time = 'L\'heure est requise';
    if (!formData.stade) newErrors.stade = 'Le stade est requis';
    if (!formData.equipe1) newErrors.equipe1 = 'L\'équipe 1 est requise';
    if (!formData.equipe2) newErrors.equipe2 = 'L\'équipe 2 est requise';
    if (!formData.arbitre_principal) newErrors.arbitre_principal = 'L\'arbitre principal est requis';
    if (!formData.assistant1) newErrors.assistant1 = 'L\'assistant 1 est requis';
    if (!formData.assistant2) newErrors.assistant2 = 'L\'assistant 2 est requis';
    if (!formData.quatrieme_arbitre) newErrors.quatrieme_arbitre = 'Le 4ème arbitre est requis';
    if (!formData.ligue) newErrors.ligue = 'La ligue est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({
        date: '',
        time: '',
        equipe1: '',
        equipe2: '',
        stade: '',
        arbitre_principal: '',
        assistant1: '',
        assistant2: '',
        quatrieme_arbitre: '',
        ligue: ''
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      date: '',
      time: '',
      equipe1: '',
      equipe2: '',
      stade: '',
      arbitre_principal: '',
      assistant1: '',
      assistant2: '',
      quatrieme_arbitre: '',
      ligue: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">⚽ Nouveau Match</h2>
            <button
              onClick={handleClose}
              className="text-white/70 hover:text-white transition-colors text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-white/70 mt-2">Ajouter un nouveau match</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section Type de Ligue */}
          <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
            <h3 className="text-xl font-bold text-white mb-4 text-center">🏆 Type de Ligue</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {LIGUE_TYPES.map((ligue) => (
                <button
                  key={ligue.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, ligue: ligue.value }))}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-300 text-white font-semibold ${
                    formData.ligue === ligue.value
                      ? 'bg-red-500/60 border-white/50 shadow-lg'
                      : 'bg-white/10 border-red-500/40 hover:bg-white/20'
                  }`}
                >
                  {ligue.label}
                </button>
              ))}
            </div>
            {errors.ligue && (
              <p className="text-red-300 text-sm mt-2 text-center">{errors.ligue}</p>
            )}
          </div>

          {/* Section Date et Heure */}
          <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
            <h3 className="text-xl font-bold text-white mb-4 text-center">📅 Date et Heure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">Date du Match</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70"
                />
                {errors.date && (
                  <p className="text-red-300 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">Heure du Match</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70"
                />
                {errors.time && (
                  <p className="text-red-300 text-sm mt-1">{errors.time}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Informations du Match */}
          <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
            <h3 className="text-xl font-bold text-white mb-4 text-center">⚽ Informations du Match</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">Équipe 1</label>
                <input
                  type="text"
                  name="equipe1"
                  value={formData.equipe1}
                  onChange={handleInputChange}
                  placeholder="Nom de l'équipe 1"
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70 placeholder-white/50"
                />
                {errors.equipe1 && (
                  <p className="text-red-300 text-sm mt-1">{errors.equipe1}</p>
                )}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">Équipe 2</label>
                <input
                  type="text"
                  name="equipe2"
                  value={formData.equipe2}
                  onChange={handleInputChange}
                  placeholder="Nom de l'équipe 2"
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70 placeholder-white/50"
                />
                {errors.equipe2 && (
                  <p className="text-red-300 text-sm mt-1">{errors.equipe2}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/90 text-sm font-semibold mb-2">Stade</label>
                <input
                  type="text"
                  name="stade"
                  value={formData.stade}
                  onChange={handleInputChange}
                  placeholder="Nom du stade"
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70 placeholder-white/50"
                />
                {errors.stade && (
                  <p className="text-red-300 text-sm mt-1">{errors.stade}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Équipe Arbitrale */}
          <div className="bg-red-800/60 rounded-xl p-6 border-2 border-red-600/60">
            <h3 className="text-xl font-bold text-white mb-4 text-center">👨‍⚖️ Équipe Arbitrale</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">Arbitre Principal</label>
                <input
                  type="text"
                  name="arbitre_principal"
                  value={formData.arbitre_principal}
                  onChange={handleInputChange}
                  placeholder="Nom de l'arbitre principal"
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70 placeholder-white/50"
                />
                {errors.arbitre_principal && (
                  <p className="text-red-300 text-sm mt-1">{errors.arbitre_principal}</p>
                )}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">Assistant 1</label>
                <input
                  type="text"
                  name="assistant1"
                  value={formData.assistant1}
                  onChange={handleInputChange}
                  placeholder="Nom de l'assistant 1"
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70 placeholder-white/50"
                />
                {errors.assistant1 && (
                  <p className="text-red-300 text-sm mt-1">{errors.assistant1}</p>
                )}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">Assistant 2</label>
                <input
                  type="text"
                  name="assistant2"
                  value={formData.assistant2}
                  onChange={handleInputChange}
                  placeholder="Nom de l'assistant 2"
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70 placeholder-white/50"
                />
                {errors.assistant2 && (
                  <p className="text-red-300 text-sm mt-1">{errors.assistant2}</p>
                )}
              </div>

              <div>
                <label className="block text-white/90 text-sm font-semibold mb-2">4ème Arbitre</label>
                <input
                  type="text"
                  name="quatrieme_arbitre"
                  value={formData.quatrieme_arbitre}
                  onChange={handleInputChange}
                  placeholder="Nom du 4ème arbitre"
                  className="w-full px-4 py-3 bg-white/15 backdrop-blur-sm border-2 rounded-xl focus:outline-none transition-all duration-300 text-white border-red-500/60 focus:border-white/70 placeholder-white/50"
                />
                {errors.quatrieme_arbitre && (
                  <p className="text-red-300 text-sm mt-1">{errors.quatrieme_arbitre}</p>
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/30 font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-green-500/30 backdrop-blur-sm text-green-300 rounded-xl hover:bg-green-500/40 transition-all duration-300 border border-green-500/50 font-semibold"
            >
              Créer le Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}










