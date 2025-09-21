# Hướng dẫn Deploy lên GitHub Pages

## Chuẩn bị

1. Đảm bảo project của bạn đã được push lên GitHub repository
2. Đảm bảo có file `.env.local` với GEMINI_API_KEY (không push file này lên GitHub)

## Cách deploy

### Phương pháp 1: Sử dụng GitHub Actions (Tự động - Khuyến nghị)

1. **Thiết lập GitHub Pages trong repository settings:**
   - Vào repository trên GitHub
   - Chọn Settings → Pages 
   - Source: chọn "GitHub Actions"

2. **Thiết lập Environment Secret:**
   - Vào Settings → Secrets and variables → Actions
   - Tạo secret mới với tên `GEMINI_API_KEY` và giá trị API key của bạn

3. **Push code lên GitHub:**
   ```bash
   git add .
   git commit -m "Setup GitHub Pages deployment"
   git push origin main
   ```

4. **GitHub Actions sẽ tự động:**
   - Build project khi có push/pull request
   - Deploy lên GitHub Pages
   - URL sẽ có dạng: `https://[username].github.io/trợ-lý-ai-cho-sale-bất-động-sản/`

### Phương pháp 2: Deploy thủ công với gh-pages

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

## Lưu ý quan trọng

1. **API Key Security:** 
   - Không bao giờ commit file `.env.local` 
   - Sử dụng GitHub Secrets cho production deployment

2. **Base URL:**
   - Project đã được cấu hình với base path `/trợ-lý-ai-cho-sale-bất-động-sản/`
   - Nếu đổi tên repository, cần cập nhật `base` trong `vite.config.ts`

3. **Custom Domain (tùy chọn):**
   - Nếu muốn sử dụng domain riêng, tạo file `public/CNAME` với nội dung là domain của bạn
   - Ví dụ: `echo "yourdomain.com" > public/CNAME`

## Troubleshooting

- Nếu trang không load đúng: Kiểm tra base path trong vite.config.ts
- Nếu API không hoạt động: Kiểm tra GitHub Secrets đã thiết lập đúng chưa
- Nếu build lỗi: Kiểm tra dependencies và TypeScript errors

## Môi trường Development

Để chạy local:
```bash
npm install
npm run dev
```