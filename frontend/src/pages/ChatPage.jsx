import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic, MicOff, Loader } from 'lucide-react';
import apiClient from '../services/api';
import voiceService from '../services/voiceService';
import { useLanguage } from '../context/LanguageContext';

export default function ChatPage() {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: t('messages.welcomeMessage'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/triage/', {
        symptoms: input,
        lat: null,
        lng: null,
        district: '',
        session_id: '',
      });

      // Format the AI response into readable text
      const data = response.data;
      const riskColor = {
        'HIGH': '🔴',
        'MEDIUM': '🟡',
        'LOW': '🟢'
      }[data.risk] || '⚪';

      const analysisText = `${riskColor} Risk Level: ${data.risk}

${data.brief_advice}

📋 Detailed Advice:
${data.detailed_advice}

🍎 Foods to Eat:
${data.food_eat}

❌ Foods to Avoid:
${data.food_avoid}

✅ Do's:
${data.dos?.replace(/\|/g, '\n')}

⛔ Don'ts:
${data.donts?.replace(/\|/g, '\n')}`;

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: analysisText,
        timestamp: new Date(),
        isAnalysis: true,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error details:', error.response || error.message || error);
      const errorText = error.response?.data?.error || error.message || t('messages.connectionError');
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Error: ${errorText}`,
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!voiceService.isSupported()) {
      alert('Speech recognition not supported in your browser');
      return;
    }

    if (listening) {
      voiceService.stopListening();
      setListening(false);
    } else {
      voiceService.initialize(currentLanguage);
      setListening(true);

      voiceService.startListening(
        (text, isInterim) => {
          if (!isInterim) {
            setInput((prev) => prev + (prev ? ' ' : '') + text);
            setListening(false);
          }
        },
        (error) => {
          console.error('Voice error:', error);
          setListening(false);
        }
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      {/* Header */}
      <div className="bg-white border-b border-primary-200 shadow-sm p-6">
        <h1 className="text-2xl font-bold text-primary-900">{t('chat.title')}</h1>
        <p className="text-primary-600">{t('chat.description')}</p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md lg:max-w-2xl p-4 rounded-xl ${
                message.sender === 'user'
                  ? 'bg-primary-500 text-white rounded-br-none'
                  : 'bg-white border border-primary-200 text-primary-900 rounded-bl-none'
              }`}
            >
              {message.isAnalysis ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold mb-2">{t('chat.analysis')}</h3>
                    {message.text.risk_level && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{t('chat.riskLevel')}:</span>
                          <span
                            className={`px-3 py-1 rounded-full text-white font-bold ${
                              message.text.risk_level === 'HIGH'
                                ? 'bg-red-500'
                                : message.text.risk_level === 'MEDIUM'
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }`}
                          >
                            {message.text.risk_level}
                          </span>
                        </div>
                        {message.text.brief_advice && (
                          <div>
                            <p className="font-semibold">{t('chat.advice')}:</p>
                            <p>{message.text.brief_advice}</p>
                          </div>
                        )}
                        {message.text.food_eat && (
                          <div>
                            <p className="font-semibold">{t('chat.foodToEat')}:</p>
                            <p>{message.text.food_eat}</p>
                          </div>
                        )}
                        {message.text.food_avoid && (
                          <div>
                            <p className="font-semibold">{t('chat.foodToAvoid')}:</p>
                            <p>{message.text.food_avoid}</p>
                          </div>
                        )}
                        {message.text.dos && (
                          <div>
                            <p className="font-semibold">{t('chat.doThis')}:</p>
                            <p>{message.text.dos}</p>
                          </div>
                        )}
                        {message.text.donts && (
                          <div>
                            <p className="font-semibold">{t('chat.dontDoThis')}:</p>
                            <p>{message.text.donts}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : message.isError ? (
                <p className="text-red-500">{message.text}</p>
              ) : (
                <p>{message.text}</p>
              )}
              <p className="text-xs mt-2 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-primary-200 p-4 rounded-xl rounded-bl-none">
              <div className="flex items-center gap-2">
                <Loader className="w-5 h-5 text-primary-500 animate-spin" />
                <p className="text-primary-600">{t('messages.sendingSymptoms')}</p>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-primary-200 shadow-lg p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t('chat.placeholder')}
            className="flex-1 px-4 py-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
          />
          <button
            onClick={toggleVoiceInput}
            className={`p-3 rounded-xl transition ${
              listening
                ? 'bg-red-500 text-white'
                : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
            }`}
            title={listening ? t('chat.stopListening') : t('chat.startListening')}
          >
            {listening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105 font-medium flex items-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>{t('chat.sendMessage')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
