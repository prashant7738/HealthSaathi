# HealthSaathi Frontend - README

## Project Overview

HealthSaathi is an AI-powered health triage system frontend built with React + Vite. The application provides a user-friendly interface for:

- Symptom analysis using voice and text input
- Real-time AI health recommendations
- Nearby hospital and clinic locator (with OpenStreetMap integration)
- Health dashboard with statistics and history
- User profile management

## Technology Stack

- **Frontend Framework**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Mapping**: Leaflet + OpenStreetMap
- **Internationalization**: i18next (English & Nepali)
- **Voice Input**: Web Speech API
- **State Management**: React Context API
- **Routing**: React Router v6

## Features

### 1. Authentication
- User login and registration
- Token-based authentication
- Session persistence

### 2. Chat Interface
- Real-time messaging with AI health assistant
- Voice-to-text input (English & Nepali support)
- Symptom analysis with AI
- Risk level assessment (High, Medium, Low)
- Personalized health recommendations
  - Brief and detailed advice
  - Food recommendations (eat/avoid)
  - Do's and Don'ts
- Message history

### 3. Map Page
- Interactive map using Leaflet & OpenStreetMap
- Geolocation support
- Filter facilities by type (Hospital, Clinic, Pharmacy)
- Nearby facility search
- Contact information display
- Distance calculations

### 4. Dashboard
- User health statistics
- Session history
- Risk level distribution
- Trend analysis
- Recent analysis records

### 5. Profile Management
- Personal information editing
- Medical history tracking
- Blood type management
- Allergy documentation
- Current medications tracking
- Settings and preferences

### 6. Internationalization
- Full support for English and Nepali
- Language switcher in sidebar
- Persistent language preference

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── Sidebar.jsx
│   └── LoadingSpinner.jsx
├── pages/               # Page components
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ChatPage.jsx
│   ├── MapPage.jsx
│   ├── DashboardPage.jsx
│   └── ProfilePage.jsx
├── context/             # React Context
│   ├── AuthContext.jsx
│   └── LanguageContext.jsx
├── services/            # API and external services
│   ├── api.js
│   └── voiceService.js
├── locales/             # i18n translations
│   ├── en.json
│   └── ne.json
├── styles/              # Global styles
│   └── index.css
├── i18n.js             # i18n configuration
├── App.jsx             # Main app component
└── main.jsx            # React entry point
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Python backend running on `http://localhost:8000`

### Installation Steps

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Environment Variables

- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000/api`)

## API Integration

The frontend communicates with the Django backend at:

### Key Endpoints

- `POST /triage/register/` - User registration
- `POST /triage/login/` - User login
- `POST /triage/logout/` - User logout
- `POST /triage/triage/` - Symptom analysis
- `GET /triage/stats/` - Dashboard statistics
- `GET /triage/history/` - User triage history

All requests are authenticated using token-based auth (Authorization header).

## Theme Colors

The application uses a light green color scheme:

- **Primary Green**: #22c55e (500) to #166534 (800)
- **Accent Blue**: #38bdf8 (400)
- **White background** with green gradients
- **Risk colors**: Red (High), Yellow (Medium), Green (Low)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Note on Speech Recognition
Voice input uses the Web Speech API. Supported languages:
- English (en-US)
- Nepali (ne-NP)

## AI Integration

The frontend sends symptoms to the Django backend, which uses:
- **LLM**: Groq API with Claude Haiku
- **Processing**: Python with custom medical triage logic

The AI response includes:
- Risk level assessment
- Medical advice
- Dietary recommendations
- Home care instructions
- Facility type recommendations

## Customization

### Change Theme Colors
Edit `tailwind.config.js` in the `colors.primary` section.

### Add New Pages
1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation item in `Sidebar.jsx`

### Add Translations
1. Add keys in `src/locales/en.json` and `src/locales/ne.json`
2. Use `useTranslation()` hook in components

## Performance Optimizations

- Code splitting with React Router
- Lazy loading of maps
- Optimized re-renders with React Context
- Minified production builds with Vite

## Troubleshooting

### CORS Issues
Ensure the Django backend has CORS configured:
```python
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

### API Connection Failed
- Check if backend is running on `http://localhost:8000`
- Verify `VITE_API_URL` in `.env` file
- Check browser console for error messages

### Voice Input Not Working
- Ensure using HTTPS in production (required for Web Speech API)
- Check browser permissions for microphone access
- Verify browser supports Web Speech API

## Future Enhancements

- [ ] Push notifications
- [ ] Video consultations
- [ ] Prescription management
- [ ] Insurance integration
- [ ] Offline mode
- [ ] Dark mode
- [ ] Advanced analytics
- [ ] Multi-user family profiles

## License

MIT

## Support

For issues and feature requests, contact the development team.
