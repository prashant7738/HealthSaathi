import { useContext, useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { translations } from '../i18n/translations';

export default function VoiceButton({ onTranscript }) {
  const { language, isListening, setIsListening, voiceEnabled } = useContext(AppContext);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');
  const t = translations[language];

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = language === 'ne' ? 'ne-NP' : 'en-US';

      recognizer.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognizer.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptText + ' ';
          } else {\n            interimTranscript += transcriptText;
          }
        }

        setTranscript(interimTranscript || finalTranscript);

        if (finalTranscript) {
          if (onTranscript) {
            onTranscript(finalTranscript.trim());
          }
        }
      };

      recognizer.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognizer);
    }
  }, [language, onTranscript, setIsListening]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ne' ? 'ne-NP' : 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!voiceEnabled) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-all ${
          isListening
            ? 'bg-red-100 text-red-600 hover:bg-red-200'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        }`}
        title={isListening ? t.stop_listening : t.start_listening}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>
      {isListening && (
        <div className="flex items-center gap-2">
          <div className="animate-pulse flex gap-1">
            <div className="w-1 h-3 bg-red-500 rounded-full" />
            <div className="w-1 h-3 bg-red-500 rounded-full animation-delay-100" />
            <div className="w-1 h-3 bg-red-500 rounded-full animation-delay-200" />
          </div>
          <span className="text-xs text-gray-600 font-medium">{t.listening}</span>
        </div>
      )}
    </div>
  );
}
