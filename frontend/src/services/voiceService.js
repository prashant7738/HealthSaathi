// Web Speech API service for voice to text
class VoiceService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = SpeechRecognition ? new SpeechRecognition() : null;
    this.isListening = false;
  }

  initialize(language = 'en-US') {
    if (!this.recognition) {
      console.warn('Speech Recognition not supported in this browser');
      return false;
    }

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.language = language === 'ne' ? 'ne-NP' : 'en-US';
    
    return true;
  }

  startListening(onResult, onError) {
    if (!this.recognition) {
      onError(new Error('Speech Recognition not supported'));
      return;
    }

    this.isListening = true;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      onResult(finalTranscript || interimTranscript, !finalTranscript);
    };

    this.recognition.onerror = (event) => {
      onError(new Error(`Speech recognition error: ${event.error}`));
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    this.recognition.start();
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  isSupported() {
    return !!this.recognition;
  }
}

export default new VoiceService();
