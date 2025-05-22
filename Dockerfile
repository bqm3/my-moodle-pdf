# Sử dụng Node.js phiên bản mới
FROM node:18-alpine

# Đặt thư mục làm việc trong container (thay đổi từ `app` thành `src`)
WORKDIR /src

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies mà không bị lỗi version
RUN npm install --legacy-peer-deps

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Chạy Next.js ở chế độ production
CMD ["npm", "start"]
