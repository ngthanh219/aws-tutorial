## RUN APP

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## DOCS
├── src/
│   ├── components/     # Chứa các thành phần giao diện dùng chung
│   │   ├── Header/     # Header component
│   │   ├── Footer/     # Footer component
│   │   └── UI/         # Các thành phần giao diện tái sử dụng (Button, Modal, etc.)
│   ├── features/       # Mô-đun hóa các tính năng
│   │   ├── auth/       # Chức năng liên quan đến xác thực
│   │   ├── dashboard/  # Quản lý các trang dashboard
│   │   └── users/      # Quản lý tính năng của người dùng
│   ├── hooks/          # Custom hooks
│   │   └── useAuth.ts  # Hook để kiểm tra trạng thái xác thực
│   ├── services/       # Chứa logic giao tiếp với API
│   │   ├── apiClient.ts
│   │   └── userService.ts
│   ├── store/          # Quản lý state (sử dụng Redux, Zustand, hoặc Context API)
│   │   ├── index.ts
│   │   └── userSlice.ts
│   ├── styles/         # Các tệp CSS hoặc thư viện styled-components, Tailwind CSS
│   │   ├── globals.css
│   │   └── variables.css
│   ├── utils/          # Các hàm tiện ích
│   │   ├── formatDate.ts
│   │   └── validateForm.ts
│   ├── types/          # Các định nghĩa TypeScript
│       ├── user.ts
│       └── api.ts
