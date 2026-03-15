import { useState, useRef } from 'react';
import { Send, Plus, Clock, Trash2 } from 'lucide-react';
import VoiceButton from '../components/VoiceButton';

const MOCK_CHAT_HISTORY = [
  {
    id: 1,
    title: 'Recent headache symptoms',
    preview: 'Try to stay hydrated...',
    date: new Date(Date.now() - 3600000),
  },
  {
    id: 2,
    title: 'Sleep quality issues',
    preview: 'Establish a regular sleep...',
    date: new Date(Date.now() - 86400000),
  },
  {
    id: 3,
    title: 'Diet recommendations',
    preview: 'Include more vegetables...',
    date: new Date(Date.now() - 172800000),
  },
];

const INITIAL_MESSAGE = {
  id: 1,
  content: "Hello! I'm your HealthAI assistant. How can I help you with your health concerns today?",
  sender: 'ai',
  timestamp: new Date(),
};

export default function ChatPage() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
    // Auto-focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = {
        id: messages.length + 2,
        content: 'I understand your concern. Based on what you\'ve told me, I recommend consulting with a healthcare professional for a proper diagnosis. In the meantime, make sure to stay hydrated and get adequate rest.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <div className="h-full flex">
      {/* Chat History Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all font-medium"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">Recent Conversations</h3>
          {MOCK_CHAT_HISTORY.map((chat) => (
            <div
              key={chat.id}
              className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer border border-transparent hover:border-gray-200 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 truncate mt-1">{chat.preview}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{chat.date.toLocaleDateString()}</span>
                  </div>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded">
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Chat with HealthAI</h2>
          <p className="text-sm text-gray-500 mt-1">Ask me anything about your health concerns</p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-md rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Describe your symptoms or ask a health question..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
              <VoiceButton onTranscript={handleVoiceTranscript} />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all flex items-center justify-center"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              ⚠️ This is an AI assistant. Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
