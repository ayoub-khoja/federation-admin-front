"use client";

import React, { useState } from 'react';

interface Designation {
  id: string;
  date: string;
  time: string;
  match: string;
  equipe1: string;
  equipe2: string;
  stade: string;
  arbitre_principal: string;
  assistant1: string;
  assistant2: string;
  quatrieme_arbitre: string;
  ligue?: string; // Ajout du type de ligue
}

interface DesignationsListProps {
  designations: Designation[];
  onAddNew: () => void;
}

// Types de ligues disponibles
const LIGUE_TYPES = [
  { value: 'all', label: 'Toutes les Ligues', color: 'bg-blue-500/30' },
  { value: 'ligue1', label: 'Ligue 1', color: 'bg-red-500/30' },
  { value: 'ligue2', label: 'Ligue 2', color: 'bg-orange-500/30' },
  { value: 'c1', label: 'Coupe 1', color: 'bg-green-500/30' },
  { value: 'c2', label: 'Coupe 2', color: 'bg-purple-500/30' },
  { value: 'jeunes', label: 'Jeunes', color: 'bg-yellow-500/30' }
];

export default function DesignationsList({ designations, onAddNew }: DesignationsListProps) {
  const [selectedLigue, setSelectedLigue] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBannerModal, setShowBannerModal] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  // Filtrer les désignations selon la ligue sélectionnée et le terme de recherche
  const filteredDesignations = designations.filter(designation => {
    const matchesLigue = selectedLigue === 'all' || designation.ligue === selectedLigue;
    const matchesSearch = searchTerm === '' || 
      designation.equipe1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.equipe2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.stade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      designation.arbitre_principal.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesLigue && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Bannière FTF exactement comme l'image */}
        <div className="bg-red-600 p-8 relative border-2 border-dashed border-white mb-8">
          {/* Flèches à gauche */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
            <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
            <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
            <div className="w-6 h-6 border-2 border-white rounded-sm"></div>
          </div>

          {/* Logo FTF à droite */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center shadow-lg border-2 border-red-600">
              <div className="text-center">
                {/* Texte "تونس" en haut */}
                <div className="text-red-600 text-xs font-bold mb-1">تونس</div>
                {/* Aigle tunisien stylisé */}
                <div className="text-red-600 text-2xl font-bold mb-1">🦅</div>
                {/* Cercle avec croissant et étoile */}
                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-white text-xs">🌙⭐</div>
                </div>
                {/* Texte FTF en bas */}
                <div className="text-red-600 text-xs font-bold mt-1">FEDERATION TUNISIENNE DE FOOTBALL</div>
              </div>
            </div>
          </div>

          {/* Texte en arabe centré */}
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4" dir="rtl">
              الإدارة الوطنية للتحكيم
            </h1>
            <h2 className="text-3xl font-semibold mb-4" dir="rtl">
              تعيينات الحكام
            </h2>
            <p className="text-2xl" dir="rtl">
              مباريات ودية
            </p>
          </div>
        </div>

        {/* Contenu principal centré */}
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            {/* Bouton principal */}
            <button 
              onClick={() => setShowBannerModal(true)}
              className="bg-green-500/30 backdrop-blur-sm text-green-300 px-12 py-6 rounded-2xl hover:bg-green-500/40 transition-all duration-300 border-2 border-green-500/50 flex items-center space-x-4 mx-auto text-2xl font-semibold shadow-2xl hover:shadow-green-500/25 hover:scale-105"
            >
              <span className="text-3xl">➕</span>
              <span>Ajouter Désignation</span>
            </button>
          </div>
        </div>
      </div>


      {/* Modal avec le design EXACT de l'image */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-red-600 max-w-6xl w-full shadow-2xl border-2 border-dashed border-white">
            {/* Bannière FTF EXACTE comme l'image */}
            <div className="bg-red-600 p-6 relative">
              {/* Flèches à gauche */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex space-x-1">
                <div className="w-5 h-5 bg-white rounded-sm"></div>
                <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
                <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
                <div className="w-5 h-5 border-2 border-white rounded-sm"></div>
              </div>

              {/* Logo FTF à droite */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <img 
                  src="/ftf-logo.png" 
                  alt="Logo FTF" 
                  className="w-20 h-20 object-contain"
                />
              </div>

              {/* Texte en arabe centré */}
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4" dir="rtl">
                  الإدارة الوطنية للتحكيم
                </h1>
                <h2 className="text-3xl font-semibold mb-4" dir="rtl">
                  تعيينات الحكام
                </h2>
                <p className="text-2xl" dir="rtl">
                  مباريات ودية
                </p>
              </div>
            </div>

            {/* Barre de date grise */}
            <div className="bg-gray-600 py-3">
              <h3 className="text-yellow-400 text-xl font-bold text-center" dir="rtl">
                الجمعة 05 سبتمبر 2025 - س 16 00 دق
              </h3>
            </div>

            {/* Tableau des désignations */}
            <div className="bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">الملعب</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">المقابلة</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">الحكم</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">المساعد الأول</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">المساعد الثاني</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">الحكم الرابع</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 text-black text-right border border-black bg-blue-200" dir="rtl">مركب جرجيس</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">الترجي الرياضي الجرجيسي vs الاتحاد الرياضي بتطاوين</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">أسامة قبيبيعة</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">فهمي جلاب</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">مراد اللطيف</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">حسام الظاهري</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-black text-right border border-black bg-blue-200" dir="rtl">الطيب المهيري صفاقس</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">النادي الرياضي الصفاقسي vs الكوكب الرياضي بعقارب</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">حسام بالحاج علي</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">محمد علي مهدي</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">هشام أولاد علي</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">ياسين الهماني</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Barre de date grise pour le 2ème tableau */}
            <div className="bg-gray-600 py-3">
              <h3 className="text-yellow-400 text-xl font-bold text-center" dir="rtl">
                السبت 06 سبتمبر 2025 - س 17 00 دق
              </h3>
            </div>

            {/* 2ème Tableau des désignations */}
            <div className="bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">الملعب</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">المقابلة</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">الحكم</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">المساعد الأول</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">المساعد الثاني</th>
                    <th className="px-4 py-3 text-white font-semibold text-right border border-black" dir="rtl">الحكم الرابع</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3 text-black text-right border border-black bg-blue-200" dir="rtl">الحديقة ب</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">الترجي الرياضي التونسي vs سانت لوبوبو الكنغولي</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">خليل الجريء</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">زياد الضويوي</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">علاء الصامتي</td>
                    <td className="px-4 py-3 text-black text-right border border-black bg-white" dir="rtl">حسام بن ساسي</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Adresse du site web */}
            <div className="bg-red-600 text-center py-4">
              <p className="text-white text-lg font-semibold">WWW.FTF.ORG.TN</p>
            </div>

            {/* Flèches en bas à droite */}
            <div className="bg-red-600 flex justify-end space-x-1 p-4">
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <div className="w-5 h-5 bg-white rounded-sm"></div>
              <div className="w-5 h-5 bg-white rounded-sm"></div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-4 p-6 bg-gray-100">
              <button
                onClick={() => setShowBannerModal(false)}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  onAddNew();
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ajouter Désignation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
