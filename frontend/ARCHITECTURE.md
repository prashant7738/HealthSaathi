# HealthSaathi Frontend - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  React Application                     │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │            Main App (App.jsx)                    │  │  │
│  │  │  - Routing (React Router v6)                    │  │  │
│  │  │  - Auth check                                    │  │  │
│  │  │  - Provider setup                               │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │                          │                             │  │
│  ├──────────────────────────┼─────────────────────────────┤  │
│  │         Providers         │                             │  │
│  ├──────────────────────────┼─────────────────────────────┤  │
│  │  ┌────────────────┐  ┌────────────────────────────┐   │  │
│  │  │  AuthProvider  │  │  LanguageProvider          │   │  │
│  │  │                │  │                            │   │  │
│  │  │ - Login        │  │ - Language state           │   │  │
│  │  │ - Register     │  │ - changeLanguage()         │   │  │
│  │  │ - Logout       │  │ - currentLanguage          │   │  │
│  │  │ - Token mgmt   │  │                            │   │  │
│  │  └────────────────┘  └────────────────────────────┘   │  │
│  │         │                          │                    │  │
│  └─────────┼──────────────────────────┼────────────────────┘  │
│            │                          │                       │
│  ┌────────┴──────────────────────────┴──────────────────┐   │
│  │                   Page Components                      │   │
│  │  ┌──────────┬──────────┬──────────┬──────────┐        │   │
│  │  │  Login   │ Register │  Chat    │   Map    │        │   │
│  │  │  Page    │  Page    │  Page    │   Page   │        │   │
│  │  └──────────┴──────────┴──────────┴──────────┘        │   │
│  │  ┌──────────┬──────────┐                              │   │
│  │  │Dashboard │ Profile  │                              │   │
│  │  │ Page     │ Page     │                              │   │
│  │  └──────────┴──────────┘                              │   │
│  └─────────────────────────────────────────────────────┘   │
│            │                          │                     │
│  ┌─────────┴──────────────────────────┴──────────────────┐   │
│  │              UI Components                             │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │  Sidebar                                         │  │   │
│  │  │  - Navigation menu                              │  │   │
│  │  │  - Language switcher                            │  │   │
│  │  │  - Logout button                                │  │   │
│  │  │  - User branding                                │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  │  ┌─────────────────────────────────────────────────┐  │   │
│  │  │  LoadingSpinner                                 │  │   │
│  │  │  - Reusable loading indicator                   │  │   │
│  │  └─────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│            │                          │                     │
│  ┌─────────┴──────────────────────────┴──────────────────┐   │
│  │              Services                                 │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐  │   │
│  │  │   API Client     │  │   Voice Service          │  │   │
│  │  │                  │  │                          │  │   │
│  │  │ - get()          │  │ - initialize()           │  │   │
│  │  │ - post()         │  │ - startListening()       │  │   │
│  │  │ - Auth headers   │  │ - stopListening()        │  │   │
│  │  │ - Token attach   │  │ - Web Speech API         │  │   │
│  │  └──────────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│            │                          │                     │
│  ┌─────────┴──────────────────────────┴──────────────────┐   │
│  │            Utilities                                  │   │
│  │  ┌──────────────────┐  ┌──────────────────────────┐  │   │
│  │  │   i18n Config    │  │   Tailwind CSS           │  │   │
│  │  │                  │  │                          │  │   │
│  │  │ - English (en)   │  │ - Light green theme      │  │   │
│  │  │ - Nepali (ne)    │  │ - Responsive design      │  │   │
│  │  │ - Switch lang    │  │ - Custom colors          │  │   │
│  │  └──────────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
                      ┌──────────────┐
                      │   API Calls  │
                      │   with Auth  │
                      └──────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Django Backend API                         │
│                 (http://localhost:8000)                     │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Authentication Endpoints                         │   │
│  │  - POST /triage/register/                         │   │
│  │  - POST /triage/login/                            │   │
│  │  - POST /triage/logout/                           │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Triage Endpoints                                 │   │
│  │  - POST /triage/triage/ (AI analysis)             │   │
│  │  - GET  /triage/stats/  (dashboard stats)         │   │
│  │  - GET  /triage/history/ (user history)           │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend Services                           │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Groq AI (Claude Haiku)                           │   │
│  │  - Symptom analysis                               │   │
│  │  - Risk assessment                                │   │
│  │  - Medical advice generation                      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                              │   │
│  │  - User accounts                                  │   │
│  │  - Triage sessions                                │   │
│  │  - Medical history                                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                 User Login                              │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  LoginPage.jsx:                                         │
│  - Collect email & password                            │
│  - Call useAuth().login()                              │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  AuthContext:                                           │
│  - API call: POST /triage/login/                       │
│  - Send: {email, password}                             │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Backend Response:                                      │
│  - {user: {...}, token: "abc123..."}                   │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  AuthContext:                                           │
│  - Save token to localStorage                          │
│  - Set auth header: Authorization: Token abc123...     │
│  - Update user state                                   │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  React Router:                                          │
│  - Redirect to /chat                                   │
│  - App now shows authenticated routes                  │
└─────────────────────────────────────────────────────────┘
```

### 2. Symptom Analysis Flow

```
┌─────────────────────────────────────────────────────────┐
│  User enters symptoms in ChatPage                       │
│  - Types: "I have fever and cough"                      │
│  - OR clicks mic button for voice input               │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  ChatPage:                                              │
│  - Add user message to state                           │
│  - Call apiClient.post('/triage/triage/', {...})       │
│  - Show loading indicator                              │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  API Client:                                            │
│  - Add Authorization header                            │
│  - Send symptom text to backend                        │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Django Backend:                                        │
│  - Receive symptom text                                │
│  - Send to Groq API (Claude LLM)                       │
│  - AI analyzes and returns:                            │
│    * risk_level (HIGH/MEDIUM/LOW)                      │
│    * brief_advice                                      │
│    * detailed_advice                                   │
│    * food_eat / food_avoid                             │
│    * dos / donts                                       │
│    * nepali_advice                                     │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  ChatPage:                                              │
│  - Receive analysis response                           │
│  - Add bot message with formatted response             │
│  - Display:                                            │
│    * Risk level badge (colored)                        │
│    * All advice sections                               │
│  - Remove loading indicator                            │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  User sees:                                             │
│  - AI-powered health recommendations                   │
│  - Can continue conversation                           │
│  - Can navigate to other pages                         │
└─────────────────────────────────────────────────────────┘
```

### 3. Voice-to-Text Flow

```
┌─────────────────────────────────────────────────────────┐
│  User clicks Mic button in ChatPage                     │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  VoiceService:                                          │
│  - Initialize Web Speech API                           │
│  - Set language (current: en-US or ne-NP)              │
│  - Call recognition.start()                            │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Browser:                                               │
│  - Request microphone permission                       │
│  - User clicks Allow                                   │
│  - Visual: Mic button turns red, shows "Listening..." │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Web Speech API:                                        │
│  - Captures audio input                                │
│  - Processes speech                                    │
│  - Returns transcript                                  │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  VoiceService onResult callback:                        │
│  - Receive transcript text                             │
│  - Allow interim results feedback                      │
│  - Final result triggers input update                  │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  ChatPage:                                              │
│  - Update input field with transcript                  │
│  - User can edit or send                               │
│  - Mic button returns to normal state                  │
└─────────────────┬───────────────────────────────────────┘
```

### 4. Map Display Flow

```
┌─────────────────────────────────────────────────────────┐
│  User navigates to /map (MapPage)                       │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  MapPage:                                               │
│  - useEffect hook runs                                 │
│  - Call navigator.geolocation.getCurrentPosition()     │
│  - Show loading state                                  │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Browser Geolocation API:                               │
│  - Request location permission                         │
│  - Return latitude & longitude                         │
│  OR fallback to default (Kathmandu center)             │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Leaflet:                                               │
│  - Initialize map with position                        │
│  - Load OpenStreetMap tiles                            │
│  - Render map container                                │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  MapPage:                                               │
│  - Add user location marker (default icon)             │
│  - Add facility markers:                               │
│    * Hospitals (red markers)                           │
│    * Clinics (blue markers)                            │
│    * Pharmacies (green markers)                        │
│  - Add click handlers for popups                       │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  Sidebar List:                                          │
│  - Display all facilities                              │
│  - Show distance                                       │
│  - Show contact info                                   │
│  - Allow filtering by type                             │
└─────────────────┬───────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────┐
│  User interaction:                                      │
│  - Click markers to see details                        │
│  - Click facility list items                           │
│  - Filter by facility type                             │
│  - See contact information                             │
└─────────────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App (src/App.jsx)
│
├── AuthProvider
│   └── LanguageProvider
│       ├── BrowserRouter
│       │   ├── LoginPage
│       │   ├── RegisterPage
│       │   └── Authenticated Layout:
│       │       ├── Sidebar
│       │       │   ├── Navigation Menu
│       │       │   ├── Language Switcher
│       │       │   └── Logout Button
│       │       │
│       │       └── Routes:
│       │           ├── ChatPage
│       │           │   ├── Message Area
│       │           │   └── Input Area
│       │           │       ├── Text Input
│       │           │       ├── Voice Button
│       │           │       └── Send Button
│       │           │
│       │           ├── MapPage
│       │           │   ├── Controls
│       │           │   ├── MapContainer (Leaflet)
│       │           │   └── Sidebar (Facilities List)
│       │           │
│       │           ├── DashboardPage
│       │           │   ├── Stats Cards
│       │           │   └── History Table
│       │           │
│       │           └── ProfilePage
│       │               ├── Personal Info
│       │               └── Medical History
```

---

## State Management

### AuthContext
```javascript
{
  user: { id, email, first_name },
  token: "abc123xyz...",
  loading: false,
  functions: { login, register, logout }
}
```

### LanguageContext
```javascript
{
  currentLanguage: "en" | "ne",
  changeLanguage: (lang) => void
}
```

### Component State Examples

**ChatPage**:
```javascript
{
  messages: Array<Message>,
  input: string,
  loading: boolean,
  listening: boolean
}
```

**MapPage**:
```javascript
{
  position: [lat, lng],
  facilities: Array<Facility>,
  loading: boolean,
  error: string,
  selectedType: "all" | "hospital" | "clinic" | "pharmacy"
}
```

**DashboardPage**:
```javascript
{
  stats: {
    totalSessions: number,
    highRiskCount: number,
    mediumRiskCount: number,
    lowRiskCount: number,
    recentSessions: Array<Session>
  },
  loading: boolean
}
```

---

## Data Models

### User
```typescript
{
  id: number
  email: string
  first_name: string
}
```

### Token
```typescript
string (stored in localStorage)
```

### TriageSession
```typescript
{
  id: number
  symptoms: string
  risk_level: "HIGH" | "MEDIUM" | "LOW"
  brief_advice: string
  detailed_advice: string
  food_eat: string
  food_avoid: string
  dos: string
  donts: string
  nepali_advice: string
  created_at: string (ISO timestamp)
  district: string
  latitude: number
  longitude: number
}
```

### Facility
```typescript
{
  id: number
  name: string
  type: "hospital" | "clinic" | "pharmacy"
  lat: number
  lng: number
  distance: number (in km)
  contact: string
}
```

### Message
```typescript
{
  id: number
  sender: "user" | "bot"
  text: string | TriageSession
  timestamp: Date
  isAnalysis?: boolean
  isError?: boolean
}
```

---

## Technologies Used

### Frontend Library
- **React 18**: UI framework
- **React Router v6**: Routing
- **React i18next**: Translations

### Styling
- **Tailwind CSS**: Utility-first CSS
- **Lucide React**: Icons

### External Services
- **Leaflet**: Map library
- **OpenStreetMap**: Map tiles
- **Web Speech API**: Voice recognition

### Build & Dev Tools
- **Vite**: Build tool
- **PostCSS**: CSS processing
- **npm**: Package manager

### HTTP Communication
- **Fetch API**: Network requests (wrapped in custom client)

---

## Performance Considerations

1. **Code Splitting**: React Router lazy loads pages
2. **Memoization**: Components use React.memo where appropriate
3. **Conditional Rendering**: Only render when needed
4. **API Caching**: Could add caching layer for stats
5. **Image Optimization**: Use optimized map tiles from CDN
6. **CSS**: Tailwind PurgeCSS removes unused styles in production

---

## Security Architecture

1. **Token Storage**: localStorage (could upgrade to sessionStorage)
2. **Auth Headers**: Automatically added to protected requests
3. **CORS**: Configured on backend
4. **HTTPS**: Required in production for voice API
5. **Input Validation**: Backend validates all inputs
6. **Password**: Hashed by backend, never stored on frontend

---

**Architecture Last Updated**: March 2026  
**Version**: 1.0.0