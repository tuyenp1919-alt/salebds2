import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { aiService, ChatMessage, PropertyData, MarketAnalysis } from '../services/aiServices';

interface AIState {
  // Chat state
  messages: ChatMessage[];
  isTyping: boolean;
  currentTool: string;
  
  // Voice state
  isListening: boolean;
  isGeneratingSpeech: boolean;
  
  // File upload state
  isAnalyzingFile: boolean;
  uploadedFiles: File[];
  
  // Data state
  properties: PropertyData[];
  marketData: MarketAnalysis | null;
  
  // UI state
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'auto';
  animations: boolean;
  
  // User preferences
  preferences: {
    voiceEnabled: boolean;
    autoSuggestions: boolean;
    marketAlerts: boolean;
    language: 'vi' | 'en';
  };
}

type AIAction =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'SET_CURRENT_TOOL'; payload: string }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_GENERATING_SPEECH'; payload: boolean }
  | { type: 'SET_ANALYZING_FILE'; payload: boolean }
  | { type: 'ADD_FILE'; payload: File }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'SET_PROPERTIES'; payload: PropertyData[] }
  | { type: 'SET_MARKET_DATA'; payload: MarketAnalysis }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<AIState['preferences']> }
  | { type: 'CLEAR_CONVERSATION' }
  | { type: 'LOAD_STATE'; payload: Partial<AIState> };

const initialState: AIState = {
  messages: [],
  isTyping: false,
  currentTool: 'chatbot',
  isListening: false,
  isGeneratingSpeech: false,
  isAnalyzingFile: false,
  uploadedFiles: [],
  properties: [],
  marketData: null,
  sidebarCollapsed: false,
  theme: 'auto',
  animations: true,
  preferences: {
    voiceEnabled: true,
    autoSuggestions: true,
    marketAlerts: true,
    language: 'vi'
  }
};

function aiReducer(state: AIState, action: AIAction): AIState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    
    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload
      };
    
    case 'SET_CURRENT_TOOL':
      return {
        ...state,
        currentTool: action.payload
      };
    
    case 'SET_LISTENING':
      return {
        ...state,
        isListening: action.payload
      };
    
    case 'SET_GENERATING_SPEECH':
      return {
        ...state,
        isGeneratingSpeech: action.payload
      };
    
    case 'SET_ANALYZING_FILE':
      return {
        ...state,
        isAnalyzingFile: action.payload
      };
    
    case 'ADD_FILE':
      return {
        ...state,
        uploadedFiles: [...state.uploadedFiles, action.payload]
      };
    
    case 'REMOVE_FILE':
      return {
        ...state,
        uploadedFiles: state.uploadedFiles.filter(file => file.name !== action.payload)
      };
    
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload
      };
    
    case 'SET_MARKET_DATA':
      return {
        ...state,
        marketData: action.payload
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      };
    
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        animations: !state.animations
      };
    
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    
    case 'CLEAR_CONVERSATION':
      return {
        ...state,
        messages: []
      };
    
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };
    
    default:
      return state;
  }
}

interface AIContextValue {
  state: AIState;
  
  // Chat actions
  sendMessage: (content: string, metadata?: ChatMessage['metadata']) => Promise<void>;
  addSystemMessage: (content: string) => void;
  clearConversation: () => void;
  
  // Tool actions
  setCurrentTool: (tool: string) => void;
  
  // Voice actions
  startListening: () => Promise<void>;
  stopListening: () => void;
  generateSpeech: (text: string) => Promise<void>;
  
  // File actions
  uploadFile: (file: File) => Promise<void>;
  removeFile: (fileName: string) => void;
  analyzeImage: (file: File) => Promise<void>;
  
  // Data actions
  searchProperties: (query: string) => Promise<void>;
  analyzeMarket: (region: string) => Promise<void>;
  
  // UI actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  toggleAnimations: () => void;
  updatePreferences: (preferences: Partial<AIState['preferences']>) => void;
  
  // Utility actions
  saveState: () => void;
  loadState: () => void;
}

const AIContext = createContext<AIContextValue | null>(null);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: React.ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('ai_assistant_state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage
  const saveState = useCallback(() => {
    const stateToSave = {
      currentTool: state.currentTool,
      theme: state.theme,
      animations: state.animations,
      preferences: state.preferences,
      sidebarCollapsed: state.sidebarCollapsed
    };
    localStorage.setItem('ai_assistant_state', JSON.stringify(stateToSave));
  }, [state]);

  const loadState = useCallback(() => {
    const savedState = localStorage.getItem('ai_assistant_state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading saved state:', error);
      }
    }
  }, []);

  // Chat actions
  const sendMessage = useCallback(async (content: string, metadata?: ChatMessage['metadata']) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      metadata
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    dispatch({ type: 'SET_TYPING', payload: true });

    try {
      const response = await aiService.generateResponse([...state.messages, userMessage]);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        metadata: {
          type: 'text',
          suggestions: generateSuggestions(response)
        }
      };

      dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
        timestamp: new Date()
      };
      dispatch({ type: 'ADD_MESSAGE', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false });
    }
  }, [state.messages]);

  const addSystemMessage = useCallback((content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'system',
      content,
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_MESSAGE', payload: systemMessage });
  }, []);

  const clearConversation = useCallback(() => {
    dispatch({ type: 'CLEAR_CONVERSATION' });
  }, []);

  // Tool actions
  const setCurrentTool = useCallback((tool: string) => {
    dispatch({ type: 'SET_CURRENT_TOOL', payload: tool });
    saveState();
  }, [saveState]);

  // Voice actions
  const startListening = useCallback(async () => {
    if (!state.preferences.voiceEnabled) return;
    
    dispatch({ type: 'SET_LISTENING', payload: true });
    
    try {
      // Mock voice recording (replace with real implementation)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription
      const mockAudio = new Blob(['mock audio'], { type: 'audio/wav' });
      const transcription = await aiService.transcribeVoice(mockAudio);
      
      if (transcription) {
        await sendMessage(transcription, { type: 'voice' });
      }
    } catch (error) {
      console.error('Voice listening error:', error);
    } finally {
      dispatch({ type: 'SET_LISTENING', payload: false });
    }
  }, [state.preferences.voiceEnabled, sendMessage]);

  const stopListening = useCallback(() => {
    dispatch({ type: 'SET_LISTENING', payload: false });
  }, []);

  const generateSpeech = useCallback(async (text: string) => {
    if (!state.preferences.voiceEnabled) return;
    
    dispatch({ type: 'SET_GENERATING_SPEECH', payload: true });
    
    try {
      const audioBuffer = await aiService.generateSpeech(text);
      
      // Play the generated speech
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioData = await audioContext.decodeAudioData(audioBuffer);
      const source = audioContext.createBufferSource();
      source.buffer = audioData;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error('Speech generation error:', error);
    } finally {
      dispatch({ type: 'SET_GENERATING_SPEECH', payload: false });
    }
  }, [state.preferences.voiceEnabled]);

  // File actions
  const uploadFile = useCallback(async (file: File) => {
    dispatch({ type: 'ADD_FILE', payload: file });
    
    if (file.type.startsWith('image/')) {
      await analyzeImage(file);
    }
  }, []);

  const removeFile = useCallback((fileName: string) => {
    dispatch({ type: 'REMOVE_FILE', payload: fileName });
  }, []);

  const analyzeImage = useCallback(async (file: File) => {
    dispatch({ type: 'SET_ANALYZING_FILE', payload: true });
    
    try {
      const imageUrl = URL.createObjectURL(file);
      const analysis = await aiService.analyzePropertyImage(imageUrl);
      
      const analysisMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📷 **Phân tích hình ảnh bất động sản:**\n\n${analysis.description}\n\n**Tình trạng:** ${analysis.condition}\n**Ước tính giá trị:** ${analysis.estimatedValue}\n**Đặc điểm:** ${analysis.features.join(', ')}`,
        timestamp: new Date(),
        metadata: { type: 'image', data: analysis }
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: analysisMessage });
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error('Image analysis error:', error);
    } finally {
      dispatch({ type: 'SET_ANALYZING_FILE', payload: false });
    }
  }, []);

  // Data actions
  const searchProperties = useCallback(async (query: string) => {
    // Mock property search (replace with real implementation)
    const mockProperties: PropertyData[] = [
      {
        id: '1',
        title: 'Căn hộ cao cấp Vinhomes Golden River',
        location: 'Quận 1, TP.HCM',
        price: 8500000000,
        area: 95,
        type: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        images: ['https://picsum.photos/400/300?random=1'],
        description: 'Căn hộ cao cấp view sông Sài Gòn',
        features: ['View sông', 'Nội thất cao cấp', 'Bảo vệ 24/7']
      }
    ];
    
    dispatch({ type: 'SET_PROPERTIES', payload: mockProperties });
  }, []);

  const analyzeMarket = useCallback(async (region: string) => {
    try {
      const marketAnalysis = await aiService.analyzeMarket(region);
      dispatch({ type: 'SET_MARKET_DATA', payload: marketAnalysis });
      
      const marketMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `📊 **Phân tích thị trường ${region}:**\n\n**Giá trung bình:** ${marketAnalysis.averagePrice.toLocaleString('vi-VN')} VNĐ/m²\n**Biến động:** ${marketAnalysis.priceChange > 0 ? '+' : ''}${marketAnalysis.priceChange}%\n**Xu hướng:** ${marketAnalysis.marketTrend === 'up' ? '📈 Tăng' : marketAnalysis.marketTrend === 'down' ? '📉 Giảm' : '📊 Ổn định'}\n\n**Dự báo:**\n• 3 tháng: ${marketAnalysis.predictions.shortTerm}%\n• 1 năm: ${marketAnalysis.predictions.mediumTerm}%\n• 3 năm: ${marketAnalysis.predictions.longTerm}%`,
        timestamp: new Date(),
        metadata: { type: 'text', data: marketAnalysis }
      };
      
      dispatch({ type: 'ADD_MESSAGE', payload: marketMessage });
    } catch (error) {
      console.error('Market analysis error:', error);
    }
  }, []);

  // UI actions
  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
    saveState();
  }, [saveState]);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    saveState();
  }, [saveState]);

  const toggleAnimations = useCallback(() => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
    saveState();
  }, [saveState]);

  const updatePreferences = useCallback((preferences: Partial<AIState['preferences']>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    saveState();
  }, [saveState]);

  // Helper function to generate suggestions
  const generateSuggestions = (response: string): string[] => {
    const suggestions = [
      'Tìm căn hộ tương tự',
      'Phân tích thị trường khu vực này',
      'Tạo nội dung marketing',
      'Ước tính giá thuê',
      'So sánh với dự án khác'
    ];
    
    return suggestions.slice(0, 3);
  };

  const contextValue: AIContextValue = {
    state,
    sendMessage,
    addSystemMessage,
    clearConversation,
    setCurrentTool,
    startListening,
    stopListening,
    generateSpeech,
    uploadFile,
    removeFile,
    analyzeImage,
    searchProperties,
    analyzeMarket,
    toggleSidebar,
    setTheme,
    toggleAnimations,
    updatePreferences,
    saveState,
    loadState
  };

  return (
    <AIContext.Provider value={contextValue}>
      {children}
    </AIContext.Provider>
  );
};

// Declare global types for Web Audio API
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}