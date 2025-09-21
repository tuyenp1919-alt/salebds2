
import { GoogleGenAI, Type } from "@google/genai";
import type { Project, Client } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const getAiChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "Bạn là một trợ lý AI chuyên gia về bất động sản tại Việt Nam. Hãy trả lời các câu hỏi của nhân viên kinh doanh một cách ngắn gọn, chính xác và chuyên nghiệp. Cung cấp thông tin về chính sách bán hàng, so sánh dự án, và đưa ra kịch bản xử lý từ chối hiệu quả.",
      },
      history: history,
    });
    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.";
  }
};

export const matchClientToProjects = async (client: Client, projects: Project[]): Promise<string> => {
  const prompt = `
    Dựa trên thông tin khách hàng và danh sách dự án dưới đây, hãy phân tích và gợi ý 3 dự án phù hợp nhất.
    Với mỗi dự án gợi ý, giải thích ngắn gọn tại sao nó phù hợp.

    **Thông tin khách hàng:**
    - Nhu cầu: ${client.needs}
    - Ngân sách: ${new Intl.NumberFormat('vi-VN').format(client.budget)} VNĐ

    **Danh sách dự án:**
    ${projects.map(p => `- ${p.name}: ${p.description} Giá từ ${p.priceMin/1000000000} đến ${p.priceMax/1000000000} tỷ. Loại hình: ${p.type}.`).join('\n')}

    Trả lời bằng tiếng Việt.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Đã có lỗi xảy ra khi phân tích. Vui lòng thử lại.";
  }
};

export const createMarketingContent = async (project: Project): Promise<string> => {
  const prompt = `
    Viết một bài đăng marketing hấp dẫn trên Facebook để quảng cáo dự án bất động sản sau đây.
    Bài viết cần có tiêu đề giật gân, nội dung cuốn hút, thông tin chính xác, và lời kêu gọi hành động mạnh mẽ. Sử dụng emoji phù hợp.

    **Thông tin dự án:**
    - Tên dự án: ${project.name}
    - Vị trí: ${project.location}
    - Điểm nổi bật: ${project.description}
    - Mức giá: Từ ${project.priceMin/1000000000} tỷ đồng
    - Chính sách bán hàng: ${project.policy}

    Trả lời bằng tiếng Việt.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Không thể tạo nội dung. Vui lòng thử lại.";
  }
};

export const analyzeFengShui = async (birthYear: number): Promise<string> => {
  const prompt = `
    Tôi là một người sinh năm ${birthYear}.
    Hãy cho tôi biết:
    1. Tôi thuộc mệnh gì?
    2. Tôi thuộc Đông Tứ Mệnh hay Tây Tứ Mệnh?
    3. Các hướng nhà tốt (Sinh Khí, Diên Niên, Thiên Y, Phục Vị) và hướng nhà xấu (Tuyệt Mệnh, Ngũ Quỷ, Lục Sát, Họa Hại) đối với tôi là gì?

    Trình bày kết quả một cách rõ ràng, dễ hiểu. Trả lời bằng tiếng Việt.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Không thể phân tích phong thủy. Vui lòng thử lại.";
  }
};

export const analyzeLocation = async (address: string): Promise<string> => {
    const prompt = `
    Phân tích tiềm năng vị trí của bất động sản tại địa chỉ: "${address}, Việt Nam".
    
    Đánh giá các yếu tố sau:
    1.  **Tiện ích xung quanh:** Khoảng cách đến trường học, bệnh viện, trung tâm thương mại, chợ lớn trong bán kính 5km.
    2.  **Giao thông:** Các trục đường chính gần đó, tình trạng kẹt xe, khả năng kết nối đến trung tâm thành phố.
    3.  **Tiềm năng tăng giá:** Dựa vào các quy hoạch hạ tầng (nếu có thông tin công khai), sự phát triển của khu vực, và các dự án lớn lân cận.
    
    Đưa ra nhận định tổng quan về việc đây có phải là một vị trí tốt để ở hoặc đầu tư hay không. Trả lời bằng tiếng Việt.
  `;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Không thể phân tích vị trí. Vui lòng thử lại.";
  }
};
