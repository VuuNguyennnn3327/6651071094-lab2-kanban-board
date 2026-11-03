# Tài liệu Wireframe & Thiết kế Giao diện

- **Sinh viên thực hiện**: Nguyễn Trường Vũ
- **MSSV**: 6651071094
- **Chủ đề**: Quản lý công việc kiểu Kanban
- **Màu chủ đạo**: Emerald (`#059669`)

## 1. Bản vẽ Wireframe
- File wireframe đồ họa vector: [`wireframe.svg`](./wireframe.svg)
- Bố cục gồm 4 cột trạng thái:
  1. **Cần làm (To Do)**
  2. **Đang làm (In Progress)**
  3. **Chờ duyệt (Review)**
  4. **Hoàn thành (Done)**

## 2. Thiết kế Đáp ứng (Responsive Breakpoints)
Theo đúng yêu cầu tại mục III.4 của đề bài:
1. **Mobile (< 640px)**:
   - Hiển thị bố cục 1 cột tối ưu cho màn hình cảm ứng di động.
   - Thanh điều hướng Tab ở phía trên cho phép người dùng chuyển nhanh giữa các cột (To Do, In Progress, Review, Done).
2. **Tablet (640px – 1024px)**:
   - Hiển thị dạng lưới 2 cột (`sm:grid-cols-2`), tự động xếp đều các cột.
3. **Desktop (> 1024px)**:
   - Hiển thị đầy đủ 4 cột Kanban nằm ngang (`lg:grid-cols-4`), hỗ trợ kéo thả xuyên suốt giữa các cột với không gian rộng rãi.

## 3. Tiêu chuẩn Tiếp cận (Accessibility - A11y)
- Toàn bộ ảnh đại diện nhân viên đều có thuộc tính `alt` mô tả thật (ví dụ: `alt="Ảnh đại diện của Nguyễn Trường Vũ"`).
- Toàn bộ các nút chỉ dùng icon (Close, Edit, Delete, Grip kéo thả) đều có thuộc tính `aria-label` tương ứng.
- Modal tạo và sửa công việc hỗ trợ phím `ESC` để đóng và có bẫy tiêu điểm (`focus trap`) bàn phím bên trong.
- Tông màu Emerald `#059669` kết hợp nền sáng đạt tỉ lệ tương phản vượt chuẩn WCAG AA ($\ge 4.5:1$).
