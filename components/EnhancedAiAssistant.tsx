import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Icon } from './Icon';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'general' | 'analysis' | 'content' | 'prediction';
}

const AI_TOOLS: AITool[] = [
  {
    id: 'chatbot',
    name: 'Chat Assistant',
    description: 'Trò chuyện trực tiếp với AI về bất cứ vấn đề gì',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    category: 'general'
  },
  {
    id: 'property-matcher',
    name: 'Property Matcher',
    description: 'Ghép cặp khách hàng với bất động sản phù hợp',
    icon: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
    category: 'analysis'
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    description: 'Phân tích thị trường và dự báo giá bất động sản',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    category: 'analysis'
  },
  {
    id: 'content-generator',
    name: 'Content Generator',
    description: 'Tạo nội dung marketing chuyên nghiệp',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    category: 'content'
  },
  {
    id: 'lead-scorer',
    name: 'Lead Scorer',
    description: 'Đánh giá và chấm điểm tiềm năng khách hàng',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    category: 'analysis'
  },
  {
    id: 'price-estimator',
    name: 'Price Estimator',
    description: 'Ước tính giá bất động sản dựa trên AI',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1',
    category: 'prediction'
  },
  {
    id: 'contract-analyzer',
    name: 'Contract Analyzer',
    description: 'Phân tích và kiểm tra hợp đồng tự động',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    category: 'analysis'
  },
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Tạo nội dung cho mạng xã hội và quảng cáo',
    icon: 'M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4v16a2 2 0 002 2h6a2 2 0 002-2V4M11 6h2v4h-2V6zM13 16h2v2h-2v-2zM9 16h2v2H9v-2z',
    category: 'content'
  }
];

const QUICK_SUGGESTIONS = [
  "Tôi muốn tìm căn hộ 2 phòng ngủ tại Quận 1",
  "Phân tích thị trường bất động sản tháng này",
  "Tạo mô tả bán hàng cho villa cao cấp",
  "Ước tính giá nhà 100m2 tại Thủ Đức",
  "So sánh các dự án chung cư mới",
  "Tư vấn đầu tư bất động sản cho người mới",
];

export const EnhancedAiAssistant: React.FC = () => {
  const { user } = useAuth();
  const [activeToolId, setActiveToolId] = useState('chatbot');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Xin chào ${user?.name}! 👋\n\nTôi là AI Assistant chuyên về bất động sản. Tôi có thể giúp bạn:\n\n✨ Tư vấn mua bán bất động sản\n📊 Phân tích thị trường\n💰 Ước tính giá nhà đất\n📝 Tạo nội dung marketing\n🎯 Đánh giá khách hàng tiềm năng\n\nBạn muốn tôi hỗ trợ gì hôm nay?`,
      timestamp: new Date(),
      suggestions: QUICK_SUGGESTIONS.slice(0, 3)
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeTool = AI_TOOLS.find(tool => tool.id === activeToolId) || AI_TOOLS[0];
  const filteredTools = selectedCategory === 'all' 
    ? AI_TOOLS 
    : AI_TOOLS.filter(tool => tool.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'Tất cả', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { id: 'general', name: 'Tổng quát', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
    { id: 'analysis', name: 'Phân tích', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'content', name: 'Nội dung', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { id: 'prediction', name: 'Dự báo', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeToolId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Mock AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('căn hộ') || lowerMessage.includes('apartment')) {
      return `🏢 **Tư vấn căn hộ cho bạn:**\n\nDựa trên yêu cầu của bạn, tôi đề xuất một số lựa chọn:\n\n📍 **Quận 1 - Trung tâm:**\n• Vinhomes Golden River: 80-120m², 6-10 tỷ\n• The Marq: 70-150m², 8-15 tỷ\n• Saigon Royal: 90-200m², 7-20 tỷ\n\n📍 **Quận 2 - Hiện đại:**\n• Masteri Thảo Điền: 50-80m², 3-6 tỷ\n• Gateway Thảo Điền: 70-120m², 4-8 tỷ\n• Empire City: 80-150m², 5-12 tỷ\n\n💡 **Lời khuyên:** Nên xem xét vị trí gần trường học, bệnh viện và giao thông công cộng.\n\nBạn có muốn tôi phân tích chi tiết về dự án nào không?`;
    }
    
    if (lowerMessage.includes('thị trường') || lowerMessage.includes('market')) {
      return `📊 **Phân tích thị trường BĐS tháng ${new Date().getMonth() + 1}/2024:**\n\n📈 **Xu hướng chung:**\n• Giá nhà đất tăng 5-8% so với cùng kỳ năm trước\n• Nguồn cung căn hộ cao cấp tăng 15%\n• Nhu cầu nhà ở xã hội vẫn cao\n\n🏙️ **Theo khu vực:**\n• **Quận 1,3,5:** Ổn định, thanh khoản tốt\n• **Quận 2,7,9:** Tăng trưởng mạnh 10-12%\n• **Thủ Đức:** Hot nhất với mức tăng 15-20%\n• **Các tỉnh:** Bình Dương, Đồng Nai tăng 8-10%\n\n💰 **Dự báo 6 tháng tới:**\n• Giá sẽ tiếp tục tăng nhẹ 3-5%\n• Nguồn cung sẽ cải thiện\n• Lãi suất vay có thể giảm\n\nBạn quan tâm khu vực nào cụ thể?`;
    }
    
    if (lowerMessage.includes('giá') || lowerMessage.includes('price') || lowerMessage.includes('ước tính')) {
      return `💰 **Công cụ ước tính giá BĐS:**\n\nĐể ước tính chính xác, tôi cần thông tin:\n\n📏 **Thông số cơ bản:**\n• Diện tích (m²)\n• Vị trí cụ thể (quận/huyện)\n• Loại hình (nhà riêng/căn hộ/đất nền)\n• Tình trạng (mới/cũ)\n\n🏗️ **Thông tin bổ sung:**\n• Số tầng/phòng\n• Hướng nhà\n• Gần trường học, bệnh viện\n• Giao thông công cộng\n\n📊 **Phương pháp tính:**\n• So sánh với các BĐS tương tự\n• Phân tích xu hướng khu vực\n• Đánh giá tiềm năng phát triển\n• Tính toán ROI dự kiến\n\nHãy cung cấp thông tin chi tiết để tôi ước tính chính xác nhé!`;
    }
    
    if (lowerMessage.includes('đầu tư') || lowerMessage.includes('investment')) {
      return `🎯 **Tư vấn đầu tư BĐS thông minh:**\n\n💡 **Chiến lược cho người mới:**\n\n**Bước 1: Xác định mục tiêu**\n• Đầu tư ngắn hạn (1-2 năm): Flip house\n• Trung hạn (3-5 năm): Cho thuê\n• Dài hạn (5+ năm): Tích lũy tài sản\n\n**Bước 2: Chọn khu vực tiềm năng**\n🔥 **HOT nhất hiện tại:**\n• Thủ Đức: Hạ tầng phát triển\n• Quận 9: Khu công nghệ cao\n• Bình Dương: Giá hợp lý, tăng trưởng tốt\n\n**Bước 3: Phân tích tài chính**\n• Vốn ban đầu: 30% giá trị BĐS\n• Chi phí vay: 8-12%/năm\n• Lợi nhuận kỳ vọng: 15-25%/năm\n\n📋 **Checklist trước khi mua:**\n✅ Pháp lý rõ ràng\n✅ Vị trí có tiềm năng\n✅ Giá hợp lý so với thị trường\n✅ Khả năng thanh khoản\n\nBạn đang có bao nhiêu vốn để đầu tư?`;
    }

    // Default response
    return `🤖 Tôi hiểu bạn đang quan tâm về "${userMessage}".\n\nTôi có thể hỗ trợ bạn với:\n\n• 🔍 Tìm kiếm bất động sản phù hợp\n• 📊 Phân tích thị trường và giá cả\n• 💡 Tư vấn đầu tư thông minh\n• 📝 Tạo nội dung marketing\n• 🎯 Đánh giá khách hàng tiềm năng\n\nBạn có thể hỏi cụ thể hơn hoặc chọn một trong các gợi ý dưới đây để tôi hỗ trợ tốt hơn nhé! 😊`;
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputMessage.trim();
    if (!text || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const aiResponse = await simulateAIResponse(text);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        suggestions: QUICK_SUGGESTIONS.filter(s => 
          !messages.some(m => m.content.includes(s.slice(0, 10)))
        ).slice(0, 3)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau. 🙏',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Icon path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-500">Trợ lý thông minh cho bất động sản</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-700 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with AI Tools */}
        <div className="w-80 bg-white shadow-lg border-r flex flex-col">
          {/* Categories */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Danh mục công cụ</h3>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 p-2 rounded-lg text-xs transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon path={category.icon} className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Tools List */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {filteredTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveToolId(tool.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                    activeToolId === tool.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Icon 
                      path={tool.icon} 
                      className={`w-5 h-5 mt-0.5 ${activeToolId === tool.id ? 'text-white' : 'text-blue-500'}`} 
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{tool.name}</h4>
                      <p className={`text-xs mt-1 ${
                        activeToolId === tool.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Active Tool Header */}
          <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex items-center space-x-3">
              <Icon path={activeTool.icon} className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="font-semibold text-gray-900">{activeTool.name}</h2>
                <p className="text-sm text-gray-600">{activeTool.description}</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-3xl ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {message.content}
                    </pre>
                  </div>
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-gray-500 font-medium">💡 Gợi ý cho bạn:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(suggestion)}
                            className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className={`text-xs mt-2 opacity-60 ${
                    message.type === 'user' ? 'text-right text-white' : 'text-gray-500'
                  }`}>
                    {formatTimestamp(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">AI đang suy nghĩ...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Hỏi ${activeTool.name} bất cứ điều gì...`}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() || isTyping}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
                      inputMessage.trim() && !isTyping
                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Icon path="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Nhấn Enter để gửi, Shift+Enter để xuống dòng
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Icon path="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" className="w-3 h-3 text-green-500" />
                    <span>Bảo mật & An toàn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};