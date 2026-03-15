import { useContext } from 'react';
import { Globe } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { LANGUAGES } from '../i18n/translations';

export default function LanguageToggle() {
  const { language, setLanguage } = useContext(AppContext);
  const currentLang = LANGUAGES.find(lang => lang.code === language);

  return (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Globe size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{currentLang?.flag}</span>
        </button>
        
        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                language === lang.code
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
              {language === lang.code && <span className="ml-auto text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
