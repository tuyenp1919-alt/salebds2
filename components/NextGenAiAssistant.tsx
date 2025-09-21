import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { Icon } from './Icon';
import {
  VoiceVisualizer,
  FileDropZone,
  AnimatedChart,
  MessageSkeleton,
  FloatingActionButton,
  ProgressRing,
  NotificationToast
} from './ui/AdvancedComponents';
import '../src/styles/animations.css';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  category: 'general' | 'analysis' | 'content' | 'prediction' | 'voice' | 'visual';
  premium?: boolean;
}

const AI_TOOLS: AITool[] = [
  {
    id: 'smart-chat',
    name: 'Smart Chat',
    description: 'AI trò chuyện thông minh với khả năng hiểu context sâu',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    category: 'general'
  },
  {
    id: 'voice-assistant',
    name: 'Voice Assistant',
    description: 'Giao tiếp bằng giọng nói với AI',
    icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    category: 'voice',
    premium: true
  },
  {
    id: 'property-analyzer',
    name: 'Property Analyzer',
    description: 'Phân tích BĐS thông minh với AI Vision',
    icon: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5',
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    category: 'visual'
  },
  {
    id: 'market-predictor',
    name: 'Market Predictor',
    description: 'Dự báo thị trường bằng ML algorithms',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    category: 'prediction',
    premium: true
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Tạo content marketing tự động',
    icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
    color: 'from-violet-500 to-purple-500',
    gradient: 'bg-gradient-to-r from-violet-500 to-purple-500',
    category: 'content'
  },
  {
    id: 'lead-scorer',
    name: 'Lead Scorer',
    description: 'Chấm điểm và xếp hạng khách hàng tiềm năng',
    icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0',
    color: 'from-amber-500 to-yellow-500',
    gradient: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    category: 'analysis'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Tất cả', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16', color: 'text-gray-600' },
  { id: 'general', name: 'Tổng quát', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', color: 'text-blue-600' },
  { id: 'voice', name: 'Giọng nói', icon: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z', color: 'text-purple-600' },
  { id: 'visual', name: 'Hình ảnh', icon: 'M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z M15 12a3 3 0 11-6 0 3 3 0 016 0z', color: 'text-emerald-600' },
  { id: 'analysis', name: 'Phân tích', icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z', color: 'text-amber-600' },
  { id: 'content', name: 'Nội dung', icon: 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125', color: 'text-violet-600' },
  { id: 'prediction', name: 'Dự báo', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5z', color: 'text-orange-600' }
];

export const NextGenAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const {
    state,
    sendMessage,
    setCurrentTool,
    startListening,
    stopListening,
    generateSpeech,
    uploadFile,
    removeFile,
    toggleSidebar
  } = useAI();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  } | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTool = AI_TOOLS.find(tool => tool.id === state.currentTool) || AI_TOOLS[0];
  const filteredTools = selectedCategory === 'all' 
    ? AI_TOOLS 
    : AI_TOOLS.filter(tool => tool.category === selectedCategory);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  useEffect(() => {
    if (inputRef.current && !isVoiceMode) {
      inputRef.current.focus();
    }
  }, [activeTool, isVoiceMode]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || state.isTyping) return;

    await sendMessage(text, { type: 'text' });
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceToggle = async () => {
    if (state.isListening) {
      stopListening();
      setIsVoiceMode(false);
    } else {
      setIsVoiceMode(true);
      await startListening();
    }
  };

  const handleFileUpload = async (files: File[]) => {
    setShowFileUpload(false);
    
    for (const file of files) {
      await uploadFile(file);
      setNotification({
        message: `Đã tải lên ${file.name} thành công!`,
        type: 'success'
      });
    }
  };

  const handleToolSelect = (toolId: string) => {
    setCurrentTool(toolId);
    setNotification({
      message: `Đã chuyển sang ${AI_TOOLS.find(t => t.id === toolId)?.name}`,
      type: 'info'
    });
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 particles">
      {/* Floating Action Buttons */}
      <FloatingActionButton
        onClick={() => setShowFileUpload(true)}
        icon="M7 16V4m0 0L3 8m4-4l4 4m6 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2"
        label="Tải lên file"
        position="bottom-right"
      />
      
      <FloatingActionButton
        onClick={handleVoiceToggle}
        icon="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        label={state.isListening ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
        color={state.isListening ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-gradient-to-r from-purple-500 to-pink-500"}
        position="bottom-left"
      />

      {/* Enhanced Header */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-morphism border-b backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg hover:bg-white/20 transition-all"
            >
              <Icon path="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center animate-gradient">
                <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient">NextGen AI</h1>
                <p className="text-sm text-gray-600">Trợ lý BĐS thông minh</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-full">
              <div className={`w-2 h-2 rounded-full ${state.isTyping ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              <span className="text-xs font-medium text-gray-700">
                {state.isTyping ? 'AI đang suy nghĩ...' : 'Sẵn sàng'}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              <img 
                src={user?.avatar || "https://picsum.photos/seed/avatar/40/40"} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-white/50 hover-lift"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 bg-white/30 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-in-out z-30 ${
        state.sidebarCollapsed ? '-translate-x-full lg:w-20' : 'translate-x-0 w-80'
      } lg:translate-x-0 flex flex-col mt-20 lg:mt-0`}>
        
        {/* Categories */}
        <div className="p-6 border-b border-white/20">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Danh mục AI Tools</h3>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 p-3 rounded-xl text-xs transition-all duration-300 hover-lift ${
                  selectedCategory === category.id
                    ? 'glass-morphism shadow-lg transform scale-105'
                    : 'hover:glass-morphism'
                }`}
              >
                <Icon path={category.icon} className={`w-4 h-4 ${category.color}`} />
                {!state.sidebarCollapsed && (
                  <span className="font-medium text-gray-700">{category.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI Tools List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 stagger-animation">
          {filteredTools.map((tool, index) => (
            <button
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 hover-lift group relative overflow-hidden ${
                state.currentTool === tool.id
                  ? `${tool.gradient} text-white shadow-2xl transform scale-105 glow-blue`
                  : 'glass-morphism hover:shadow-xl'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {tool.premium && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  PRO
                </div>
              )}
              
              <div className="flex items-start space-x-3 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  state.currentTool === tool.id 
                    ? 'bg-white/20' 
                    : `${tool.gradient}`
                }`}>
                  <Icon 
                    path={tool.icon} 
                    className={`w-6 h-6 ${
                      state.currentTool === tool.id ? 'text-white' : 'text-white'
                    }`} 
                  />
                </div>
                
                {!state.sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm mb-1 ${
                      state.currentTool === tool.id ? 'text-white' : 'text-gray-800'
                    }`}>
                      {tool.name}
                    </h4>
                    <p className={`text-xs leading-relaxed ${
                      state.currentTool === tool.id ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      {tool.description}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Morphing effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Active Tool Header */}
        <div className={`p-6 mt-20 lg:mt-0 glass-morphism border-b backdrop-blur-xl ${activeTool.gradient} bg-opacity-10`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl ${activeTool.gradient} flex items-center justify-center shadow-xl animate-float`}>
                <Icon path={activeTool.icon} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  {activeTool.name}
                  {activeTool.premium && (
                    <span className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">{activeTool.description}</p>
              </div>
            </div>
            
            {/* Voice Mode Indicator */}
            {isVoiceMode && (
              <div className="flex items-center space-x-3 glass-morphism px-4 py-2 rounded-full">
                <VoiceVisualizer 
                  isListening={state.isListening} 
                  amplitude={0.7} 
                />
                <span className="text-sm font-medium text-gray-700">
                  Voice Mode
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {state.messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center animate-bounce-in">
                <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Xin chào {user?.name}! 👋
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Tôi là NextGen AI Assistant, sẵn sàng hỗ trợ bạn với mọi vấn đề về bất động sản.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {[
                  { text: "Tìm căn hộ 2PN tại Q1 dưới 5 tỷ", icon: "🏠" },
                  { text: "Phân tích thị trường BĐS tháng này", icon: "📊" },
                  { text: "Tạo mô tả bán villa cao cấp", icon: "✍️" },
                  { text: "Dự báo giá nhà Thủ Đức 2025", icon: "🔮" }
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion.text)}
                    className="p-4 glass-morphism rounded-xl hover:shadow-xl transition-all duration-300 hover-lift text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl group-hover:animate-bounce">{suggestion.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{suggestion.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {state.messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in-up`}>
              <div className={`max-w-4xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`rounded-3xl px-6 py-4 shadow-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
                    : 'glass-morphism text-gray-800'
                }`}>
                  {message.metadata?.type === 'voice' && (
                    <div className="flex items-center space-x-2 mb-2 opacity-75">
                      <Icon path="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" className="w-4 h-4" />
                      <span className="text-xs">Tin nhắn voice</span>
                    </div>
                  )}
                  
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {message.content}
                  </pre>
                  
                  {message.role === 'assistant' && (
                    <button
                      onClick={() => generateSpeech(message.content)}
                      disabled={state.isGeneratingSpeech}
                      className="mt-2 p-2 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      <Icon path="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.59-.79-1.59-1.77V9.98c0-.97.71-1.77 1.59-1.77H6.75z" className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {/* Suggestions */}
                {message.metadata?.suggestions && message.metadata.suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-gray-500 font-medium">💡 Gợi ý tiếp theo:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.metadata.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-xs glass-morphism hover:shadow-lg text-gray-700 px-4 py-2 rounded-full border border-gray-200 transition-all duration-300 hover-lift"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className={`text-xs mt-3 opacity-60 ${
                  message.role === 'user' ? 'text-right text-white' : 'text-gray-500'
                }`}>
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {state.isTyping && <MessageSkeleton />}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 glass-morphism border-t backdrop-blur-xl">
          {/* Uploaded Files */}
          {state.uploadedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {state.uploadedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center space-x-2 glass-morphism px-3 py-2 rounded-lg">
                  <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">{file.name}</span>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icon path="M6 18L18 6M6 6l12 12" className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Voice Mode Input */}
          {isVoiceMode ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <VoiceVisualizer isListening={state.isListening} amplitude={1} />
                <p className="mt-4 text-sm text-gray-600">
                  {state.isListening ? 'Đang nghe... Nói gì đi!' : 'Nhấn nút mic để bắt đầu'}
                </p>
                <button
                  onClick={() => setIsVoiceMode(false)}
                  className="mt-4 text-xs text-gray-500 hover:text-gray-700"
                >
                  Chuyển về text mode
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Hỏi ${activeTool.name} bất cứ điều gì...`}
                    className="w-full px-6 py-4 pr-16 glass-morphism rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 placeholder-gray-500"
                    disabled={state.isTyping}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || state.isTyping}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-xl transition-all ${
                      inputMessage.trim() && !state.isTyping
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-110'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-500">
                    Nhấn Enter để gửi • Shift+Enter để xuống dòng
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <button
                      onClick={() => setIsVoiceMode(true)}
                      className="hover:text-purple-600 transition-colors"
                    >
                      🎤 Voice mode
                    </button>
                    <div className="flex items-center space-x-1">
                      <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3 h-3 text-green-500" />
                      <span>Bảo mật cao</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-morphism rounded-2xl p-6 max-w-lg w-full animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Tải lên file</h3>
              <button
                onClick={() => setShowFileUpload(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon path="M6 18L18 6M6 6l12 12" className="w-5 h-5" />
              </button>
            </div>
            
            <FileDropZone
              onFilesDrop={handleFileUpload}
              acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
              maxSize={20}
            />
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};