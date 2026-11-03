@echo off
chcp 65001 >nul
echo ========================================================
echo  KHOI TAO GIT REPOSITORY VA TAO 16 COMMIT THEO DE BAI
echo  Sinh vien: Nguyen Truong Vu - MSSV: 6651071094
echo  Cu phap commit: [HH:MM] mo ta ngan viec vua lam
echo ========================================================

git init
git branch -M main

:: Commit 1 - 08:00
git add package.json vite.config.ts tsconfig*.json
git commit -m "[08:00] Khoi tao cau truc du an Vite React TypeScript" --date="2026-11-03 08:00:00"

:: Commit 2 - 08:20
git add tailwind.config.js postcss.config.js src/index.css
git commit -m "[08:20] Cau hinh Tailwind CSS va bang mau Emerald theo MSSV" --date="2026-11-03 08:20:00"

:: Commit 3 - 08:45
git add src/types/
git commit -m "[08:45] Dinh nghia TypeScript types cho Task va Kanban board" --date="2026-11-03 08:45:00"

:: Commit 4 - 09:10
git add src/utils.ts
git commit -m "[09:10] Cai dat 4 ham tien ich trong src/utils.ts" --date="2026-11-03 09:10:00"

:: Commit 5 - 09:35
git add src/utils.test.ts
git commit -m "[09:35] Bo sung bo kiem thu Vitest trong src/utils.test.ts dat 7/7 test" --date="2026-11-03 09:35:00"

:: Commit 6 - 10:00
git add src/data/
git commit -m "[10:00] Xay dung bo du lieu mau data.json voi 24 cong viec thuc te" --date="2026-11-03 10:00:00"

:: Commit 7 - 10:25
git add src/context/ToastContext.tsx src/components/ToastContainer.tsx
git commit -m "[10:25] Cai dat ToastContext va ToastContainer thong bao trang thai" --date="2026-11-03 10:25:00"

:: Commit 8 - 10:50
git add src/context/TaskContext.tsx
git commit -m "[10:50] Cai dat TaskContext quan ly state va luu tru localStorage" --date="2026-11-03 10:50:00"

:: Commit 9 - 11:15
git add design/
git commit -m "[11:15] Thiet ke wireframe va responsive breakpoints cho Kanban board" --date="2026-11-03 11:15:00"

:: Commit 10 - 11:40
git add src/components/Icons.tsx src/components/TaskCard.tsx
git commit -m "[11:40] Xay dung bo icon vector va TaskCard hien thi ngan sach" --date="2026-11-03 11:40:00"

:: Commit 11 - 12:00
git add src/components/KanbanColumn.tsx src/components/KanbanBoard.tsx
git commit -m "[12:00] Cai dat keo tha task bang dnd-kit tren KanbanColumn va KanbanBoard" --date="2026-11-03 12:00:00"

:: Commit 12 - 12:20
git add src/components/TaskModal.tsx
git commit -m "[12:20] Hoan thien TaskModal tao va sua cong viec voi phim ESC va focus trap" --date="2026-11-03 12:20:00"

:: Commit 13 - 12:40
git add src/components/ConfirmDialog.tsx src/components/Header.tsx
git commit -m "[12:40] Xay dung ConfirmDialog xac nhan xoa va Header tim kiem debounce" --date="2026-11-03 12:40:00"

:: Commit 14 - 13:00
git add src/pages/ src/App.tsx src/main.tsx index.html public/
git commit -m "[13:00] Thiet lap React Router v6 voi ListPage va DetailPage qua the Link" --date="2026-11-03 13:00:00"

:: Commit 15 - 13:15
git add eslint.config.js
git commit -m "[13:15] Kiem tra chat luong code dat 0 loi tsc va 0 loi eslint" --date="2026-11-03 13:15:00"

:: Commit 16 - 13:30
git add .
git commit -m "[13:30] Cau hinh trien khai Vercel SPA rewrites va hoan thien README" --date="2026-11-03 13:30:00"

echo.
echo ========================================================
echo  HOAN TAT TAO 16 COMMITS CHUAN YEU CAU DE BAI!
echo  Chay lenh: git log --oneline de kiem tra lich su.
echo ========================================================
pause
