import React from 'react';
import { useApp } from '../context/AppContext';

export default function LanguageToggle() {
  const { lang, toggleLang } = useApp();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/20 transition-colors"
      title="Toggle Language / भाषा परिवर्तन"
    >
      <span className={lang === 'en' ? 'opacity-100' : 'opacity-50'}>EN</span>
      <span className="opacity-40">|</span>
      <span className={lang === 'np' ? 'opacity-100' : 'opacity-50'}>नेपाली</span>
    </button>
  );
}
