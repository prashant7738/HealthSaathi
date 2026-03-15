# HealthSaathi Frontend - Setup & Installation Guide

## Quick Start

### 1. Install Dependencies
```bash
cd HealthSathi/frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env if backend is on different URL
```

### 3. Start Development Server
```bash
npm run dev
```
Access at `http://localhost:3000`

### 4. Ensure Backend is Running
The Django backend should be running on `http://localhost:8000`:
```bash
cd backend
python manage.py runserver
```

## Project Features

### ✅ Implemented
- **Auth**: Login/Register pages with token authentication
- **Chat Page**: 
  - Text input for symptoms
  - Voice-to-text input (English & Nepali)
  - AI analysis display with risk levels
  - Message history
  - Loading states

- **Map Page**:
  - Interactive OpenStreetMap with Leaflet
  - Hospital, Clinic, Pharmacy markers with different icons
  - Geolocation support
  - Facility list sidebar
  - Filter by facility type
  - Click-to-view details

- **Dashboard**:
  - User statistics (total sessions, risk distribution)
  - Recent sessions table
  - Risk level cards with color coding
  - Responsive grid layout

- **Profile Page**:
  - Personal information display/edit
  - Medical history tracking
  - Blood type, allergies, medications
  - Edit/Save functionality

- **Sidebar Navigation**:
  - Menu items for all pages
  - Language switcher (EN/NE)
  - Logout button
  - Active page indicator

- **Internationalization**:
  - Full English translation
  - Full Nepali (देवनागरी) translation
  - Language persistence (localStorage)
  - Dynamic language switching

- **Theme**:
  - Light green color scheme
  - Gradient backgrounds
  - Responsive design
  - Smooth transitions

### 🔧 Configuration Files

#### package.json
- React 18, React DOM, React Router v6
- Axios for API calls
- Leaflet for maps
- i18next for translations
- Tailwind CSS
- Vite as build tool

#### Tailwind Config
- Custom primary green colors
- Accent blue colors
- Extended theme configuration

#### Vite Config
- API proxy to Django backend
- Port 3000 for dev server
- HMR configuration

## API Endpoints Used

```
POST   /api/triage/register/          - User registration
POST   /api/triage/login/             - User login
POST   /api/triage/logout/            - User logout
POST   /api/triage/triage/            - Symptom analysis
GET    /api/triage/stats/             - Dashboard stats
```

## Authentication Flow

1. User registers/logs in
2. Token stored in localStorage
3. Token sent in Authorization header for API calls
4. App automatically redirects unauthenticated users to login

## Voice-to-Text Implementation

- Uses Web Speech API (browser native)
- Supports English (en-US) and Nepali (ne-NP)
- Works in Chrome, Edge, Firefox (some browsers require HTTPS in production)
- Automatic language detection based on app language setting

## Production Build

```bash
npm run build
```
Output: `dist/` folder (ready for deployment)

```bash
npm run preview
```
Preview the production build locally

## Troubleshooting

### Issue: "Failed to fetch from API"
**Solution**: 
- Ensure Django backend is running on http://localhost:8000
- Check VITE_API_URL in .env file
- Check browser console for CORS errors

### Issue: "Speech recognition not available"
**Solution**:
- Use supported browser (Chrome, Edge, Firefox)
- In production, use HTTPS
- Check microphone permission

### Issue: Map not loading
**Solution**:
- Ensure internet connection (needs to fetch map tiles)
- Check for 403 errors in console
- Verify Leaflet CSS is loaded (check index.html)

### Issue: Translations not showing
**Solution**:
- Clear localStorage: `localStorage.clear()`
- Check language file syntax in `src/locales/`
- Verify i18n.js is properly initialized

## Development Notes

### Adding a New Page
1. Create `src/pages/YourPage.jsx`
2. Add route in `src/App.jsx`
3. Add navigation button in `src/components/Sidebar.jsx`

### Adding Translations
1. Add key to `src/locales/en.json`
2. Add key to `src/locales/ne.json`
3. Use hook: `const { t } = useTranslation();`
4. Reference: `{t('namespace.key')}`

### Modifying Theme
Edit `src/tailwind.config.js` -> `colors.primary` section

### API Integration
- Client: `src/services/api.js`
- Usage: `import apiClient from '../services/api'`
- Methods: `apiClient.get(endpoint)`, `apiClient.post(endpoint, data)`

## File Structure Quick Reference

```
frontend/
├── src/
│   ├── components/          # React components
│   ├── context/             # Context providers
│   ├── locales/             # JSON translations
│   ├── pages/               # Page components
│   ├── services/            # API & utilities
│   ├── styles/              # CSS files
│   ├── App.jsx              # Main app
│   ├── i18n.js              # i18n setup
│   └── main.jsx             # Entry point
├── package.json             # Dependencies
├── tailwind.config.js       # Tailwind config
├── vite.config.js           # Vite config
├── postcss.config.js        # PostCSS config
├── index.html               # HTML template
├── .env.example             # Env template
├── .gitignore               # Git ignore
└── README.md                # Full documentation
```

## Next Steps

1. **Start dev server**: `npm run dev`
2. **Open browser**: http://localhost:3000
3. **Login/Register** with test credentials
4. **Test features**: Chat, Map, Dashboard, Profile
5. **Check console** for any errors
6. **Build for production**: `npm run build`

## Support

For issues:
1. Check browser console (F12)
2. Check terminal output
3. Verify backend is running
4. Review API response in Network tab (F12)

---

**Happy coding! 🚀**