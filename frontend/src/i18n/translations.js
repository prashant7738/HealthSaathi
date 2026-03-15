const translations = {
  en: {
    appName: 'NepalCare AI',
    tagline: 'Medical Triage Assistant',
    nav: { chat: 'Chat', map: 'Map', dashboard: 'Dashboard' },
    location: {
      label: 'Your Location',
      getLocation: 'Get Location',
      getting: 'Getting location...',
      lat: 'Lat', lng: 'Lng',
      denied: 'Location access denied',
      unavailable: 'Location unavailable',
      timeout: 'Location request timed out',
    },
    chat: {
      placeholder: 'Describe your symptoms...',
      send: 'Send',
      welcome: 'Hello! I am NepalCare AI. Please describe your symptoms and I will help assess your condition and find nearby health facilities.',
      thinking: 'Analyzing your symptoms...',
      risk: 'Risk Level', advice: 'Advice', action: 'Action',
      nearestPost: 'Nearest Health Facility',
      suggestedSector: 'Suggested Health Sector',
      distance: 'Distance', type: 'Type',
    },
    risk: { HIGH: 'HIGH RISK', MEDIUM: 'MEDIUM RISK', LOW: 'LOW RISK' },
    map: {
      title: 'Nearby Health Facilities',
      noLocation: 'Enable location to see nearby health facilities on the map.',
      loading: 'Loading health facilities...',
      yourLocation: 'Your Location',
    },
    dashboard: {
      title: 'Triage Statistics', total: 'Total Sessions',
      high: 'High Risk', medium: 'Medium Risk', low: 'Low Risk',
      districts: 'Top Districts', loading: 'Loading statistics...',
    },
    errors: {
      fetchFailed: 'Failed to connect to server. Please try again.',
      noSymptoms: 'Please describe your symptoms.',
    },
  },
  np: {
    appName: 'नेपालकेयर AI',
    tagline: 'चिकित्सा ट्रियाज सहायक',
    nav: { chat: 'च्याट', map: 'नक्शा', dashboard: 'ड्यासबोर्ड' },
    location: {
      label: 'तपाईंको स्थान',
      getLocation: 'स्थान प्राप्त गर्नुहोस्',
      getting: 'स्थान प्राप्त गर्दै...',
      lat: 'अक्षांश', lng: 'देशान्तर',
      denied: 'स्थान अनुमति अस्वीकार',
      unavailable: 'स्थान उपलब्ध छैन',
      timeout: 'स्थान अनुरोध समय सीमा समाप्त',
    },
    chat: {
      placeholder: 'आफ्नो लक्षणहरू वर्णन गर्नुहोस्...',
      send: 'पठाउनुहोस्',
      welcome: 'नमस्ते! म नेपालकेयर AI हुँ। कृपया आफ्नो लक्षणहरू वर्णन गर्नुहोस्।',
      thinking: 'तपाईंका लक्षणहरू विश्लेषण गर्दै...',
      risk: 'जोखिम स्तर', advice: 'सल्लाह', action: 'कार्य',
      nearestPost: 'नजिकको स्वास्थ्य सुविधा',
      suggestedSector: 'सुझाइएको स्वास्थ्य क्षेत्र',
      distance: 'दूरी', type: 'प्रकार',
    },
    risk: { HIGH: 'उच्च जोखिम', MEDIUM: 'मध्यम जोखिम', LOW: 'कम जोखिम' },
    map: {
      title: 'नजिकका स्वास्थ्य सुविधाहरू',
      noLocation: 'नक्शामा हेर्न स्थान सक्षम गर्नुहोस्।',
      loading: 'लोड हुँदैछ...',
      yourLocation: 'तपाईंको स्थान',
    },
    dashboard: {
      title: 'ट्रियाज तथ्याङ्क', total: 'कुल सत्रहरू',
      high: 'उच्च जोखिम', medium: 'मध्यम जोखिम', low: 'कम जोखिम',
      districts: 'शीर्ष जिल्लाहरू', loading: 'लोड हुँदैछ...',
    },
    errors: {
      fetchFailed: 'सर्भरसँग जडान हुन सकेन। पुनः प्रयास गर्नुहोस्।',
      noSymptoms: 'कृपया आफ्नो लक्षणहरू वर्णन गर्नुहोस्।',
    },
  },
};

export default translations;
