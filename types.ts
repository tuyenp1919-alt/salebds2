
export enum PipelineStatus {
  New = "Khách mới",
  Consulting = "Đang tư vấn",
  Meeting = "Hẹn gặp",
  Negotiating = "Đàm phán",
  Closed = "Chốt deal",
  Failed = "Thất bại"
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  needs: string;
  budget: number;
  status: PipelineStatus;
  history: string[];
}

export enum PropertyType {
  Apartment = "Căn hộ",
  Shophouse = "Shophouse",
  Villa = "Biệt thự",
  Land = "Đất nền"
}

export interface Project {
  id: number;
  name:string;
  location: string;
  priceMin: number;
  priceMax: number;
  areaMin: number;
  areaMax: number;
  type: PropertyType;
  description: string;
  imageUrl: string;
  policy: string;
}

export enum AiTool {
  Chatbot = "Chatbot AI",
  Matcher = "Gợi ý sản phẩm",
  ContentCreator = "Tạo nội dung Marketing",
  FengShui = "Phân tích phong thủy",
  LocationAnalysis = "Phân tích vị trí"
}
