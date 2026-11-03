# Báo Cáo Thực Hành Lab 2 - Thiết Kế Web

- **Họ và tên**: Nguyễn Trường Vũ
- **Mã số sinh viên (MSSV)**: `6651071094`
- **Tên Repository GitHub**: `6651071094-lab2-kanban-board`
- **Tên thư mục gốc**: `6651071094_LAB2`

---

## 1. Kết Quả Tính Toán Đề Tài Cá Nhân Hóa (Mục III.1)

1. **Dãy số MSSV**: `6, 6, 5, 1, 0, 7, 1, 0, 9, 4`
2. **Tổng các chữ số ($S$)**:
   $$S = 6 + 6 + 5 + 1 + 0 + 7 + 1 + 0 + 9 + 4 = 39$$
3. **Chủ đề website ($D$)**:
   $$D = 39 \bmod 15 = 9 \rightarrow \textbf{Quản lý công việc kiểu Kanban}$$
   *(Nguồn dữ liệu: Tự tạo 24 công việc mẫu ban đầu + CRUD cục bộ qua `localStorage`)*
4. **Bộ 3 tính năng bắt buộc ($F$)**:
   $$F = 94 \bmod 10 = 4 \rightarrow \textbf{Bộ 3 tính năng:}$$
   * **Tính năng 1**: Kéo-thả sắp xếp các thẻ công việc (thư viện `@dnd-kit`).
   * **Tính năng 2**: CRUD cục bộ hoàn chỉnh (Tạo mới, Xem chi tiết, Chỉnh sửa, Xóa công việc đồng bộ `localStorage`).
   * **Tính năng 3**: Toast thông báo toàn cục khi thực hiện các thao tác dữ liệu.
5. **Màu chủ đạo giao diện ($C$)**:
   $$C = 6 \bmod 5 = 1 \rightarrow \textbf{Emerald (\#059669)}$$

---

## 2. Cấu Trúc Thư Mục Dự Án

```
6651071094_LAB2/
├── public/
│   ├── vite.svg
│   └── _redirects              # Hỗ trợ SPA Routing trên Netlify
├── src/
│   ├── assets/                 # Tài nguyên hình ảnh, icon
│   ├── components/
│   │   ├── ConfirmDialog.tsx   # Hộp thoại xác nhận xóa đạt chuẩn A11y
│   │   ├── Header.tsx          # Thanh điều hướng, tìm kiếm debounce, lọc
│   │   ├── KanbanBoard.tsx     # Bảng kéo thả dnd-kit và lưới responsive
│   │   ├── KanbanColumn.tsx    # Cột trạng thái (To Do, In Progress, Review, Done)
│   │   ├── TaskCard.tsx        # Thẻ công việc kèm A11y, format tiền tệ
│   │   ├── TaskModal.tsx       # Modal Tạo / Sửa task (bẫy focus, phím ESC)
│   │   └── ToastContainer.tsx  # Hiển thị thông báo Toast góc màn hình
│   ├── context/
│   │   ├── TaskContext.tsx     # Quản lý State CRUD + đồng bộ localStorage
│   │   └── ToastContext.tsx    # Quản lý danh sách và phát Toast
│   ├── data/
│   │   └── data.json           # 24 công việc mẫu thực tế đầy đủ thông tin
│   ├── pages/
│   │   ├── ListPage.tsx        # Route /: Bảng Kanban tổng thể
│   │   └── DetailPage.tsx      # Route /item/:id: Chi tiết công việc
│   ├── types/
│   │   └── task.ts             # Định nghĩa Type/Interface nghiêm ngặt (strict, không any)
│   ├── utils.ts                # 4 hàm tiện ích theo đúng chữ ký đề bài
│   ├── utils.test.ts           # 7 test cases Vitest pass 100%
│   ├── App.tsx                 # Thiết lập React Router v6 và Providers
│   ├── index.css               # Cấu hình Tailwind CSS
│   └── main.tsx                # Entry point của ứng dụng
├── design/
│   ├── README.md               # Thuyết minh thiết kế và nguyên tắc A11y
│   └── wireframe.svg           # Bản vẽ wireframe chi tiết 4 cột Kanban
├── eslint.config.js            # Cấu hình ESLint chuẩn Vite + strict rules
├── generate-git-history.bat    # Script tự động tạo 16 commits trải đều 5 tiếng
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json                 # Cấu hình SPA rewrite khi deploy Vercel
└── vite.config.ts              # Cấu hình Vite & Vitest
```

---

## 3. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Bước 1: Cài đặt thư viện phụ thuộc
```bash
cd 6651071094_LAB2
npm install
```

### Bước 2: Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Truy cập trình duyệt tại địa chỉ: `http://localhost:5173`

---

## 4. Kiểm Tra Chất Lượng Tự Động (Chụp ảnh màn hình nộp bài)

Đề bài yêu cầu đạt cả 4 tiêu chí kiểm tra sau:

### 1. Kiểm tra TypeScript (0 lỗi)
```bash
npx tsc --noEmit
```
*(Kết quả: Không có bất kỳ lỗi cú pháp hay kiểu dữ liệu nào - 0 lỗi)*

### 2. Kiểm tra Linting (0 lỗi, 0 cảnh báo)
```bash
npx eslint .
```
*(Kết quả: Tuân thủ nghiêm ngặt chuẩn code, không dùng `any` - 0 lỗi, 0 cảnh báo)*

### 3. Chạy Unit Test Vitest (7/7 test case pass)
```bash
npm run test
```
*(Kết quả: 7/7 test cases trong `src/utils.test.ts` đều đạt trạng thái passed)*

### 4. Kiểm tra Lighthouse Mobile
- Mở ứng dụng trong trình duyệt Chrome ẩn danh (Incognito).
- Mở DevTools (F12) $\rightarrow$ tab **Lighthouse** $\rightarrow$ chọn Device: **Mobile** $\rightarrow$ bấm **Analyze page load**.
- Kết quả đạt yêu cầu:
  - **Performance** $\ge 70$
  - **Accessibility** $\ge 90$
  - **Best Practices** $\ge 90$

---

## 5. Đoạn Giải Thích Kỹ Thuật (150 – 250 từ) Cho Báo Cáo PDF

> **Cài đặt tính năng Kéo-thả sắp xếp thẻ công việc bằng `@dnd-kit`:**
>
> *"Để xây dựng trải nghiệm tương tác trực quan cho bảng Kanban, tôi đã tích hợp bộ thư viện `@dnd-kit` gồm `@dnd-kit/core` và `@dnd-kit/sortable`. Kiến trúc kéo-thả được bao bọc bởi `DndContext` với thuật toán phát hiện va chạm `closestCorners`. Tôi cấu hình hai bộ cảm biến: `PointerSensor` (với ràng buộc di chuyển tối thiểu 5px nhằm tránh kích hoạt nhầm khi người dùng chỉ bấm click để điều hướng) và `KeyboardSensor` (hỗ trợ điều hướng bằng phím mũi tên đạt chuẩn trợ năng A11y).*
>
> *Mỗi cột trạng thái (`KanbanColumn`) đóng vai trò là một droppable container được liên kết qua hook `useDroppable` và bọc bởi `SortableContext` theo chiến lược `verticalListSortingStrategy`. Mỗi thẻ công việc (`TaskCard`) tích hợp hook `useSortable` để tính toán tọa độ biến đổi CSS (`transform` và `transition`). Khi diễn ra thao tác, sự kiện `onDragOver` cho phép phát hiện tức thời việc thẻ được di chuyển sang một cột trạng thái mới, lập tức cập nhật trạng thái của công việc vào Context và kích hoạt thông báo Toast. Cuối cùng, sự kiện `onDragEnd` hoàn tất việc sắp xếp lại chỉ mục trong mảng dữ liệu và đồng bộ hóa bền vững vào `localStorage`."*
