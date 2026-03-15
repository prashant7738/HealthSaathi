# HealthSaathi Frontend - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
All protected endpoints require the token in the Authorization header:
```
Authorization: Token YOUR_AUTH_TOKEN
```

Tokens are obtained through login/register and stored in localStorage.

---

## Endpoints

### 1. User Registration
**Endpoint**: `POST /triage/register/`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "confirm_password": "securepassword"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John"
  },
  "token": "abc123xyz789...",
  "message": "User registered successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors (password mismatch, email exists, etc.)

---

### 2. User Login
**Endpoint**: `POST /triage/login/`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "email": "john@example.com",
    "first_name": "John"
  },
  "token": "abc123xyz789...",
  "message": "Login successful"
}
```

**Error Responses**:
- `400 Bad Request`: Missing fields
- `401 Unauthorized`: Invalid email or password

---

### 3. User Logout
**Endpoint**: `POST /triage/logout/`

**Headers**: `Authorization: Token YOUR_AUTH_TOKEN`

**Request Body**: None (empty POST)

**Response** (200 OK):
```json
{
  "message": "Logout successful"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated

---

### 4. Symptom Analysis (Triage)
**Endpoint**: `POST /triage/triage/`

**Headers**: `Authorization: Token YOUR_AUTH_TOKEN` (optional - works without auth too)

**Request Body**:
```json
{
  "symptoms": "I have a high fever, cough, and sore throat for 3 days",
  "lat": 27.7172,
  "lng": 85.3240,
  "district": "Kathmandu",
  "session_id": "session_123"
}
```

**Parameters**:
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| symptoms | string | Yes | Description of symptoms (3-1000 chars) |
| lat | float | No | User's latitude for facility matching |
| lng | float | No | User's longitude for facility matching |
| district | string | No | User's district |
| session_id | string | No | ID to track conversation sessions |

**Response** (200 OK):
```json
{
  "risk": "MEDIUM",
  "risk_level": "Medium",
  "brief_advice": "You may have a respiratory infection. Rest well, stay hydrated, and monitor your temperature.",
  "detailed_advice": "Your symptoms suggest a possible viral respiratory infection. Continue monitoring for symptoms. Seek immediate care if breathing becomes difficult.",
  "food_eat": "Warm broths, honey, ginger tea, citrus fruits, leafy greens",
  "food_avoid": "Spicy foods, dairy products, processed foods, cold drinks",
  "dos": "Get adequate sleep, drink warm fluids, use a humidifier, gargle with salt water",
  "donts": "Do not ignore persistent symptoms, avoid smoking and secondhand smoke, avoid strenuous activities",
  "nepali_advice": "तपाईंलाई श्वासप्रश्वास संक्रमण हुन सक्छ। राम्रो आराम गर्नुहोस्, हाइड्रेटेड रहनुहोस्।",
  "recommended_facility_type": "clinic"
}
```

**Risk Levels**:
- `HIGH` - Severe conditions requiring immediate medical attention
- `MEDIUM` - Moderate conditions requiring professional medical check
- `LOW` - Minor conditions manageable at home

**Error Responses**:
- `400 Bad Request`: Invalid/missing symptoms
- `401 Unauthorized`: Token expired (if using auth)

---

### 5. Dashboard Statistics
**Endpoint**: `GET /triage/stats/`

**Headers**: `Authorization: Token YOUR_AUTH_TOKEN`

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "totalSessions": 15,
  "highRiskCount": 2,
  "mediumRiskCount": 5,
  "lowRiskCount": 8,
  "recentSessions": [
    {
      "id": 1,
      "symptoms": "High fever and cough",
      "risk_level": "MEDIUM",
      "created_at": "2026-03-15T10:30:00Z",
      "brief_advice": "Rest and stay hydrated"
    },
    {
      "id": 2,
      "symptoms": "Mild headache",
      "risk_level": "LOW",
      "created_at": "2026-03-14T15:45:00Z",
      "brief_advice": "Take rest and drink water"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated

---

### 6. Triage History
**Endpoint**: `GET /triage/history/`

**Headers**: `Authorization: Token YOUR_AUTH_TOKEN`

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | int | Max results (default: 20) |
| offset | int | Pagination offset (default: 0) |

**Response** (200 OK):
```json
{
  "count": 15,
  "next": "http://localhost:8000/api/triage/history/?limit=20&offset=20",
  "previous": null,
  "results": [
    {
      "id": 1,
      "symptoms": "High fever and cough",
      "risk_level": "MEDIUM",
      "brief_advice": "Rest and stay hydrated",
      "detailed_advice": "Your symptoms suggest influenza-like illness...",
      "food_eat": "Warm fluids, honey, ginger",
      "food_avoid": "Spicy foods, dairy",
      "dos": "Get rest, use humidifier",
      "donts": "Don't ignore worsening symptoms",
      "nepali_advice": "धेरै आराम गर्नुहोस्...",
      "created_at": "2026-03-15T10:30:00Z",
      "district": "Kathmandu",
      "latitude": 27.7172,
      "longitude": 85.3240
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (registration) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

---

## Error Response Format

```json
{
  "error": "Error message describing what went wrong",
  "details": {
    "field_name": ["error message for this field"]
  }
}
```

---

## Authentication Flow

### 1. Register New User
```
POST /triage/register/
{name, email, password, confirm_password}
↓
Returns {token}
↓
Store token in localStorage
↓
Set Authorization header for future requests
```

### 2. Login User
```
POST /triage/login/
{email, password}
↓
Returns {token}
↓
Store token in localStorage
↓
Set Authorization header for future requests
```

### 3. Make Authenticated Requests
```
GET /triage/stats/
Headers: {"Authorization": "Token YOUR_TOKEN"}
↓
Backend verifies token
↓
Returns user-specific data
```

### 4. Logout User
```
POST /triage/logout/
Headers: {"Authorization": "Token YOUR_TOKEN"}
↓
Backend deletes token
↓
Frontend removes from localStorage
↓
Redirect to login
```

---

## Frontend Implementation

### API Client Setup
```javascript
// src/services/api.js
import apiClient from '../services/api';

// GET request
const response = await apiClient.get('/triage/stats/');

// POST request
const response = await apiClient.post('/triage/triage/', {
  symptoms: 'High fever...',
  lat: 27.7172,
  lng: 85.3240
});
```

### Using in Components
```javascript
import apiClient from '../services/api';

async function fetchStats() {
  try {
    const stats = await apiClient.get('/triage/stats/');
    setStats(stats);
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  }
}

// Call in useEffect
useEffect(() => {
  fetchStats();
}, []);
```

---

## Rate Limiting
No explicit rate limiting currently implemented. Production deployment should include:
- IP-based rate limiting
- User-based request throttling
- Brute force protection on auth endpoints

---

## CORS Headers
The Django backend should include:
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

---

## Example Requests

### Using cURL

**Register**:
```bash
curl -X POST http://localhost:8000/api/triage/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirm_password": "password123"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:8000/api/triage/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Analyze Symptoms**:
```bash
curl -X POST http://localhost:8000/api/triage/triage/ \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "I have a high fever and cough"
  }'
```

**Get Stats** (with auth):
```bash
curl -X GET http://localhost:8000/api/triage/stats/ \
  -H "Authorization: Token YOUR_AUTH_TOKEN"
```

---

## Troubleshooting

### CORS Error
**Problem**: "Cross-Origin Request Blocked"
**Solution**: Ensure Django has CORS enabled for `http://localhost:3000`

### Invalid Token
**Problem**: "401 Unauthorized"
**Solution**: Login again, token may have expired

### 404 on Endpoint
**Problem**: Endpoint not found
**Solution**: Check URL is correct and backend is running

### Empty Response
**Problem**: API returns empty/null
**Solution**: Check request parameters are valid

---

## Data Validation

### Symptom Input
- Minimum 3 characters
- Maximum 1000 characters
- Cannot be empty
- Required field

### Email
- Must be valid email format
- Must be unique (registration)
- Case-insensitive

### Password
- Minimum 6 characters
- Must match confirm_password on registration
- No length maximum

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Handle errors gracefully** - show user-friendly messages
3. **Store token securely** - use localStorage (or sessionStorage for higher security)
4. **Check token validity** before making requests
5. **Log errors** for debugging purposes
6. **Test with Postman** or cURL before implementing in frontend
7. **Use try-catch** blocks for async API calls
8. **Show loading states** while API call is in progress

---

## API Versioning

Current Version: **v1**
Base URL: `/api/triage/...`

Future versions may use: `/api/v2/triage/...`

---

**Last Updated**: March 2026  
**API Status**: Production Ready