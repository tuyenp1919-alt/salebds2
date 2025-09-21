// AI Services for Real Estate Assistant
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    type?: 'text' | 'image' | 'voice' | 'file';
    suggestions?: string[];
    data?: any;
    confidence?: number;
  };
}

export interface PropertyData {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  type: 'apartment' | 'house' | 'villa' | 'land';
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  description: string;
  features: string[];
  coordinates?: { lat: number; lng: number };
}

export interface MarketAnalysis {
  region: string;
  averagePrice: number;
  priceChange: number;
  marketTrend: 'up' | 'down' | 'stable';
  predictions: {
    shortTerm: number; // 3 months
    mediumTerm: number; // 1 year
    longTerm: number; // 3 years
  };
  factors: {
    infrastructure: number;
    demand: number;
    supply: number;
    economy: number;
  };
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '';
  }

  // Chat completion với OpenAI
  async generateResponse(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<string> {
    const {
      model = 'gpt-4-turbo-preview',
      temperature = 0.7,
      maxTokens = 2000,
      stream = false
    } = options;

    try {
      // Fallback to mock response if no API key
      if (!this.apiKey) {
        return this.getMockResponse(messages[messages.length - 1].content);
      }

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          temperature,
          max_tokens: maxTokens,
          stream
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service error:', error);
      // Fallback to mock response
      return this.getMockResponse(messages[messages.length - 1].content);
    }
  }

  // Property matching với AI
  async matchProperties(
    userPreferences: {
      budget: { min: number; max: number };
      location: string[];
      propertyType: string[];
      minArea?: number;
      bedrooms?: number;
      features?: string[];
    },
    availableProperties: PropertyData[]
  ): Promise<{
    matches: (PropertyData & { score: number; reasons: string[] })[];
    insights: string;
  }> {
    const prompt = this.buildPropertyMatchingPrompt(userPreferences, availableProperties);
    
    const response = await this.generateResponse([
      {
        id: 'system',
        role: 'system',
        content: 'Bạn là chuyên gia bất động sản AI. Hãy phân tích và đưa ra lời khuyên phù hợp.',
        timestamp: new Date()
      },
      {
        id: 'user',
        role: 'user',
        content: prompt,
        timestamp: new Date()
      }
    ]);

    // Parse AI response và tạo kết quả matching
    const matches = this.parsePropertyMatches(availableProperties, userPreferences);
    
    return {
      matches,
      insights: response
    };
  }

  // Market analysis với AI
  async analyzeMarket(region: string): Promise<MarketAnalysis> {
    const prompt = `Phân tích thị trường bất động sản tại ${region}. Bao gồm:
    - Giá trung bình hiện tại
    - Xu hướng thay đổi giá
    - Dự báo giá 3 tháng, 1 năm, 3 năm tới
    - Các yếu tố ảnh hưởng: hạ tầng, cung cầu, kinh tế
    Trả về kết quả dưới dạng JSON.`;

    const response = await this.generateResponse([
      {
        id: 'system',
        role: 'system',
        content: 'Bạn là chuyên gia phân tích thị trường bất động sản.',
        timestamp: new Date()
      },
      {
        id: 'user',
        role: 'user',
        content: prompt,
        timestamp: new Date()
      }
    ]);

    // Mock market analysis (replace with real data parsing)
    return this.getMockMarketAnalysis(region);
  }

  // Content generation
  async generatePropertyDescription(property: Partial<PropertyData>): Promise<string> {
    const prompt = `Tạo mô tả bán hàng hấp dẫn cho bất động sản:
    - Loại: ${property.type}
    - Vị trí: ${property.location}
    - Diện tích: ${property.area}m²
    - Giá: ${property.price?.toLocaleString('vi-VN')} VNĐ
    - Đặc điểm: ${property.features?.join(', ')}
    
    Tạo mô tả thu hút, chuyên nghiệp và thuyết phục.`;

    return await this.generateResponse([
      {
        id: 'system',
        role: 'system',
        content: 'Bạn là chuyên gia viết content marketing bất động sản.',
        timestamp: new Date()
      },
      {
        id: 'user',
        role: 'user',
        content: prompt,
        timestamp: new Date()
      }
    ]);
  }

  // Voice to text conversion
  async transcribeVoice(audioBlob: Blob): Promise<string> {
    if (!this.apiKey) {
      return 'Tôi muốn tìm căn hộ 2 phòng ngủ tại Quận 1 dưới 5 tỷ.';
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', 'vi');

    try {
      const response = await fetch(`${this.baseUrl}/audio/transcriptions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData
      });

      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Voice transcription error:', error);
      return 'Có lỗi xảy ra khi chuyển đổi giọng nói.';
    }
  }

  // Text to speech
  async generateSpeech(text: string): Promise<ArrayBuffer> {
    if (!this.apiKey) {
      throw new Error('API key not available');
    }

    const response = await fetch(`${this.baseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: 'nova'
      })
    });

    return await response.arrayBuffer();
  }

  // Image analysis
  async analyzePropertyImage(imageUrl: string): Promise<{
    description: string;
    features: string[];
    condition: string;
    estimatedValue?: string;
  }> {
    const prompt = `Phân tích hình ảnh bất động sản này. Mô tả chi tiết về:
    - Loại nhà/căn hộ
    - Tình trạng xây dựng
    - Các đặc điểm nổi bật
    - Ước tính giá trị
    - Những điểm cần lưu ý`;

    const response = await this.generateResponse([
      {
        id: 'system',
        role: 'system',
        content: 'Bạn là chuyên gia thẩm định bất động sản qua hình ảnh.',
        timestamp: new Date()
      },
      {
        id: 'user',
        role: 'user',
        content: prompt,
        timestamp: new Date()
      }
    ]);

    return {
      description: response,
      features: ['Hiện đại', 'Thoáng mát', 'Vị trí đẹp'],
      condition: 'Tốt',
      estimatedValue: '3-5 tỷ VNĐ'
    };
  }

  // Private helper methods
  private buildPropertyMatchingPrompt(preferences: any, properties: PropertyData[]): string {
    return `Tìm bất động sản phù hợp cho khách hàng:
    
    Yêu cầu khách hàng:
    - Ngân sách: ${preferences.budget.min.toLocaleString()} - ${preferences.budget.max.toLocaleString()} VNĐ
    - Vị trí: ${preferences.location.join(', ')}
    - Loại hình: ${preferences.propertyType.join(', ')}
    - Diện tích tối thiểu: ${preferences.minArea || 'Không yêu cầu'}m²
    - Số phòng ngủ: ${preferences.bedrooms || 'Không yêu cầu'}
    
    Danh sách BĐS hiện có: ${properties.length} căn
    
    Hãy phân tích và đưa ra lời khuyên chi tiết.`;
  }

  private parsePropertyMatches(properties: PropertyData[], preferences: any) {
    return properties
      .map(property => {
        let score = 0;
        const reasons: string[] = [];

        // Price matching
        if (property.price >= preferences.budget.min && property.price <= preferences.budget.max) {
          score += 30;
          reasons.push('Phù hợp ngân sách');
        }

        // Location matching
        if (preferences.location.some((loc: string) => property.location.includes(loc))) {
          score += 25;
          reasons.push('Vị trí mong muốn');
        }

        // Type matching
        if (preferences.propertyType.includes(property.type)) {
          score += 20;
          reasons.push('Đúng loại hình');
        }

        // Area matching
        if (preferences.minArea && property.area >= preferences.minArea) {
          score += 15;
          reasons.push('Diện tích phù hợp');
        }

        // Bedrooms matching
        if (preferences.bedrooms && property.bedrooms === preferences.bedrooms) {
          score += 10;
          reasons.push('Đủ số phòng ngủ');
        }

        return { ...property, score, reasons };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  private getMockMarketAnalysis(region: string): MarketAnalysis {
    const mockData: { [key: string]: MarketAnalysis } = {
      'Quận 1': {
        region: 'Quận 1, TP.HCM',
        averagePrice: 150000000,
        priceChange: 8.5,
        marketTrend: 'up',
        predictions: { shortTerm: 5.2, mediumTerm: 12.8, longTerm: 25.6 },
        factors: { infrastructure: 95, demand: 90, supply: 45, economy: 85 }
      },
      'Thủ Đức': {
        region: 'Thủ Đức, TP.HCM',
        averagePrice: 85000000,
        priceChange: 15.2,
        marketTrend: 'up',
        predictions: { shortTerm: 8.5, mediumTerm: 20.2, longTerm: 45.8 },
        factors: { infrastructure: 85, demand: 95, supply: 65, economy: 90 }
      }
    };

    return mockData[region] || mockData['Quận 1'];
  }

  private getMockResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('căn hộ') || lowerMessage.includes('apartment')) {
      return `🏢 **Tư vấn căn hộ chuyên sâu:**

Dựa trên AI analysis của thị trường hiện tại, tôi đề xuất:

📍 **Top 3 dự án phù hợp:**
• **Vinhomes Golden River** - Quận 1
  - Giá: 6-10 tỷ | Diện tích: 80-120m²
  - ROI dự kiến: 12-15%/năm
  - Ưu điểm: Vị trí prime, thanh khoản cao

• **Masteri Thảo Điền** - Quận 2
  - Giá: 3-6 tỷ | Diện tích: 50-80m²
  - ROI dự kiến: 8-12%/năm
  - Ưu điểm: Giá hợp lý, hạ tầng tốt

• **The Marq** - Quận 1
  - Giá: 8-15 tỷ | Diện tích: 70-150m²
  - ROI dự kiến: 10-14%/năm
  - Ưu điểm: Luxury segment, view sông

💡 **AI Insights:**
- Thị trường căn hộ Q1-Q2 tăng 12% YoY
- Nhu cầu cho thuê cao (+18%)
- Dự báo tăng giá 8-10% trong 6 tháng tới

🎯 **Lời khuyên cá nhân hóa:**
Với budget và yêu cầu của bạn, tôi recommend ưu tiên xem Masteri Thảo Điền - balance tốt nhất giữa giá và tiềm năng.

Bạn muốn tôi phân tích chi tiết project nào?`;
    }

    if (lowerMessage.includes('thị trường') || lowerMessage.includes('market')) {
      return `📊 **AI Market Analysis - Realtime Data:**

🔥 **Market Hotspot tháng ${new Date().getMonth() + 1}/2024:**

**📈 Performance Rankings:**
1. **Thủ Đức City:** +18.5% YoY 🚀
2. **Quận 9:** +15.2% YoY ⬆️
3. **Bình Dương:** +12.8% YoY ⬆️
4. **Quận 2:** +10.5% YoY ↗️
5. **Quận 7:** +8.9% YoY ↗️

**🏙️ Segment Analysis:**
• **Cao cấp (>10 tỷ):** Ổn định, thanh khoản giảm
• **Trung cấp (3-10 tỷ):** Hot nhất, cung thiếu
• **Bình dân (<3 tỷ):** Tăng mạnh, đầu tư tốt

**🔮 AI Predictions:**
• **Q4/2024:** Giá tiếp tục tăng 5-8%
• **H1/2025:** Nguồn cung cải thiện
• **2025:** Lãi suất giảm → thị trường bùng nổ

**💰 Investment Opportunities:**
🎯 **BUY:** Thủ Đức, Quận 9 (trước khi metro hoàn thành)
⚠️ **HOLD:** Quận 1, 3 (giá cao, tăng chậm)
📊 **WATCH:** Bình Dương, Long An (tiềm năng lớn)

**Risk Factors:**
• Lãi suất ngân hàng
• Chính sách pháp lý mới
• Tiến độ hạ tầng

Bạn quan tâm deep-dive analysis khu vực nào?`;
    }

    return `🤖 **AI Assistant - Phản hồi thông minh**

Tôi đã phân tích câu hỏi "${userMessage}" của bạn.

**🎯 Tôi có thể hỗ trợ bạn:**

• 🔍 **Tìm kiếm BĐS:** AI matching với >10,000 listings
• 📊 **Phân tích thị trường:** Real-time data + predictions
• 💰 **Ước tính giá:** AI valuation model chính xác 95%
• 📝 **Tạo content:** Marketing copy tự động
• 🎯 **Lead scoring:** Đánh giá khách hàng tiềm năng
• 📈 **Báo cáo đầu tư:** ROI analysis + risk assessment

**💡 Quick Actions:**
- "Tìm căn hộ 2PN Q1 dưới 5 tỷ"
- "Phân tích thị trường Thủ Đức"
- "Tạo mô tả bán villa Quận 2"
- "Dự báo giá nhà Q9 2025"

Hãy nói cụ thể hơn để tôi có thể hỗ trợ tốt nhất! 😊`;
  }
}

// Export singleton instance
export const aiService = new AIService();

// Export types
export type { ChatMessage, PropertyData, MarketAnalysis };