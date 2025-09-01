// Configuration des URLs de l'API
export const API_CONFIG = {
  // URLs de base
  LOCAL_API_URL: 'http://localhost:8000/api',
  PRODUCTION_API_URL: 'https://federation-backend.onrender.com/api',
  
  // URL actuelle basée sur l'environnement
  getCurrentAPIUrl: () => {
    if (process.env.NODE_ENV === 'development') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    }
    
         if (process.env.NODE_ENV === 'production') {
       return process.env.NEXT_PUBLIC_PRODUCTION_API_URL || 'https://federation-backend.onrender.com/api';
     }
    
    // Fallback basé sur l'hostname
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000/api';
      }
             return 'https://federation-backend.onrender.com/api';
    }
    
    return 'http://localhost:8000/api';
  },
  
  // Configuration des endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/accounts/admins/login/',
      LOGOUT: '/accounts/admins/logout/',
      REFRESH: '/accounts/admins/refresh/',
    },
    USERS: {
      LIST: '/accounts/users/',
      ARBITRES: '/accounts/arbitres/',
      CREATE: '/accounts/arbitres/register/',
      UPDATE: (id: string) => `/accounts/arbitres/${id}/update/`,
      DELETE: (id: string) => `/accounts/arbitres/${id}/delete/`,
      VERIFY: (id: string) => `/accounts/arbitres/${id}/verify/`,
    },
    LIGUES: {
      LIST: '/accounts/ligues/',
      CREATE: '/accounts/ligues/create/',
      UPDATE: (id: string) => `/accounts/ligues/${id}/update/`,
      DELETE: (id: string) => `/accounts/ligues/${id}/delete/`,
    },
    NEWS: {
      LIST: '/news/admin/list/',
      UPDATE: (id: string) => `/news/admin/${id}/update/`,
      DELETE: (id: string) => `/news/admin/${id}/delete/`,
    },
    MATCHES: {
      LIST: '/matches/',
      DETAIL: (id: string) => `/matches/${id}/`,
      UPDATE: (id: string) => `/matches/${id}/`,
      DELETE: (id: string) => `/matches/${id}/`,
    },
    STATS: '/accounts/stats/',
  },
  
  // Configuration des médias
  getMediaURL: (mediaPath: string) => {
    if (!mediaPath) return '';
    if (mediaPath.startsWith('http')) return mediaPath;
    
    const baseMediaURL = API_CONFIG.getCurrentAPIUrl().replace('/api', '');
    return `${baseMediaURL}${mediaPath}`;
  },
};

export default API_CONFIG;
