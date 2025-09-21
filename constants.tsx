
import type { Client, Project } from './types';
import { PipelineStatus, PropertyType } from './types';

export const INITIAL_CLIENTS: Client[] = [
  { id: 1, name: "Nguyễn Văn An", phone: "0901234567", email: "an.nguyen@email.com", needs: "Căn hộ 2PN, gần trung tâm, view đẹp", budget: 2500000000, status: PipelineStatus.New, history: ["Gọi lần 1 - 15/07"] },
  { id: 2, name: "Trần Thị Bình", phone: "0912345678", email: "binh.tran@email.com", needs: "Shophouse để kinh doanh cafe", budget: 7000000000, status: PipelineStatus.Consulting, history: ["Gặp mặt 12/07", "Gửi thông tin dự án ABC - 13/07"] },
  { id: 3, name: "Lê Hoàng Cường", phone: "0987654321", email: "cuong.le@email.com", needs: "Biệt thự sân vườn, yên tĩnh", budget: 15000000000, status: PipelineStatus.Meeting, history: ["Hẹn gặp xem nhà mẫu - 20/07"] },
  { id: 4, name: "Phạm Thu Dung", phone: "0934567890", email: "dung.pham@email.com", needs: "Đầu tư đất nền vùng ven", budget: 3000000000, status: PipelineStatus.Negotiating, history: ["Đang thương lượng giá lô A12"] },
  { id: 5, name: "Võ Minh Long", phone: "0978123456", email: "long.vo@email.com", needs: "Căn hộ 3PN cho gia đình", budget: 4000000000, status: PipelineStatus.Closed, history: ["Đã ký hợp đồng mua bán căn B-2101"] },
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 1, name: "Vinhomes Grand Park", location: "Quận 9, TP.HCM", priceMin: 2000000000, priceMax: 5000000000, areaMin: 50, areaMax: 120, type: PropertyType.Apartment, description: "Đại đô thị thông minh với công viên 36ha.", imageUrl: "https://picsum.photos/seed/project1/400/300", policy: "Chiết khấu 5% cho khách hàng thanh toán nhanh." },
  { id: 2, name: "Aqua City", location: "Đồng Nai", priceMin: 6000000000, priceMax: 20000000000, areaMin: 120, areaMax: 300, type: PropertyType.Shophouse, description: "Khu đô thị sinh thái ven sông.", imageUrl: "https://picsum.photos/seed/project2/400/300", policy: "Hỗ trợ vay 0% lãi suất trong 24 tháng." },
  { id: 3, name: "The 9 Stellars", location: "TP. Thủ Đức", priceMin: 12000000000, priceMax: 30000000000, areaMin: 200, areaMax: 500, type: PropertyType.Villa, description: "Biệt thự cao cấp, thiết kế độc bản.", imageUrl: "https://picsum.photos/seed/project3/400/300", policy: "Tặng gói nội thất 1 tỷ đồng." },
  { id: 4, name: "Gem Sky World", location: "Long Thành, Đồng Nai", priceMin: 2500000000, priceMax: 6000000000, areaMin: 100, areaMax: 200, type: PropertyType.Land, description: "Đất nền sổ đỏ, gần sân bay Long Thành.", imageUrl: "https://picsum.photos/seed/project4/400/300", policy: "Cam kết lợi nhuận 12%/năm." },
  { id: 5, name: "Masteri Centre Point", location: "Quận 9, TP.HCM", priceMin: 3500000000, priceMax: 7000000000, areaMin: 70, areaMax: 150, type: PropertyType.Apartment, description: "Căn hộ cao cấp, bàn giao full nội thất.", imageUrl: "https://picsum.photos/seed/project5/400/300", policy: "Miễn phí 3 năm phí quản lý." },
];

export const PIPELINE_STAGES = Object.values(PipelineStatus);

export const STAGE_COLORS: { [key in PipelineStatus]: string } = {
  [PipelineStatus.New]: "bg-blue-100 border-blue-500",
  [PipelineStatus.Consulting]: "bg-indigo-100 border-indigo-500",
  [PipelineStatus.Meeting]: "bg-purple-100 border-purple-500",
  [PipelineStatus.Negotiating]: "bg-yellow-100 border-yellow-500",
  [PipelineStatus.Closed]: "bg-green-100 border-green-500",
  [PipelineStatus.Failed]: "bg-red-100 border-red-500",
};

export const STAGE_TEXT_COLORS: { [key in PipelineStatus]: string } = {
  [PipelineStatus.New]: "text-blue-800",
  [PipelineStatus.Consulting]: "text-indigo-800",
  [PipelineStatus.Meeting]: "text-purple-800",
  [PipelineStatus.Negotiating]: "text-yellow-800",
  [PipelineStatus.Closed]: "text-green-800",
  [PipelineStatus.Failed]: "text-red-800",
};

export const PROPERTY_TYPES = Object.values(PropertyType);
