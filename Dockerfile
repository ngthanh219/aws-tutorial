# Sử dụng Node.js LTS
FROM node:18-alpine AS builder

# Đặt thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ code vào container
COPY . .

# Build Next.js ứng dụng
RUN npm run build

# Dùng lightweight image để chạy app
FROM node:18-alpine

WORKDIR /app

# Copy files từ builder stage
COPY --from=builder /app ./

# Expose port 3000
EXPOSE 3000

# Chạy ứng dụng Next.js
CMD ["npm", "run", "start"]
