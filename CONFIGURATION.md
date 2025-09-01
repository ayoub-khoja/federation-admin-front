# Configuration des URLs - Fédération Admin Front

## 🚀 Configuration pour le développement local et la production

### 📁 Fichiers de configuration

#### 1. `.env.local` (Développement local)
```bash
# Configuration de l'API
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_PRODUCTION_API_URL=https://federation-admin-front.vercel.app/api

# Configuration de l'environnement
NODE_ENV=development
```

#### 2. `.env.production` (Production)
```bash
# Configuration de l'API en production
NEXT_PUBLIC_API_URL=https://federation-admin-front.vercel.app/api
NEXT_PUBLIC_PRODUCTION_API_URL=https://federation-admin-front.vercel.app/api

# Configuration de l'environnement
NODE_ENV=production
```

#### 3. `vercel.json` (Configuration Vercel)
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://federation-admin-front.vercel.app/api",
    "NEXT_PUBLIC_PRODUCTION_API_URL": "https://federation-admin-front.vercel.app/api"
  }
}
```

### 🔧 Comment ça fonctionne

1. **Développement local** : L'API pointe vers `http://localhost:8000/api`
2. **Production** : L'API pointe vers `https://federation-admin-front.vercel.app/api`
3. **Fallback** : Si aucune variable d'environnement n'est définie, l'API utilise `http://localhost:8000/api`

### 🚀 Commandes de démarrage

#### Développement local
```bash
npm run dev
# ou
yarn dev
```

#### Production
```bash
npm run build
npm start
# ou
yarn build
yarn start
```

### 📱 URLs de test

- **Local** : `http://localhost:3000`
- **Production** : `https://federation-admin-front.vercel.app`

### 🔍 Vérification de la configuration

Pour vérifier que la configuration fonctionne :

1. **Développement** : Vérifiez que l'API pointe vers `localhost:8000`
2. **Production** : Vérifiez que l'API pointe vers `federation-admin-front.vercel.app`

### 🚨 Dépannage

Si l'API ne fonctionne pas :

1. Vérifiez que les fichiers `.env` sont bien créés
2. Redémarrez le serveur de développement
3. Vérifiez que les variables d'environnement sont bien chargées
4. Consultez la console du navigateur pour les erreurs

### 📝 Notes importantes

- Les variables d'environnement commençant par `NEXT_PUBLIC_` sont accessibles côté client
- Redémarrez toujours le serveur après modification des fichiers `.env`
- En production sur Vercel, les variables d'environnement sont automatiquement configurées
