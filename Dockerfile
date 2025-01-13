# Sử dụng Node.js base image
FROM node:18-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn ứng dụng vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Thiết lập biến môi trường production
ENV NODE_ENV=production

# Xóa thư mục node_modules và cài đặt lại ở chế độ production để tối ưu
RUN npm prune --production

# Thiết lập cổng mà ứng dụng sử dụng
EXPOSE 3000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
