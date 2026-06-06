# 📚 AVB Library — Library Management System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

A full-stack MERN Library Management System for academic institutions — with role-based access for Students, Librarians, and Admins, automated fine & overdue workflows, email notifications, and a real-time analytics dashboard.

</div>

---

## ✨ Key Features

| Area | Highlights |
|------|-----------|
| **Authentication** | JWT-based login, 3 separate portals (Student / Librarian / Admin), OTP password reset |
| **Book Management** | Add, update, delete books with Cloudinary image upload |
| **Borrow Workflow** | Borrow request → Librarian approval → Issue → Return request → Return |
| **Reservations** | Queue-based reservation for unavailable books |
| **Fine System** | Configurable rate/cap/grace period, auto-calculated on return, waiveable by Admin |
| **Automation** | Daily cron jobs: overdue detection, user restriction, account expiry, email alerts |
| **Dashboard** | 10+ Chart.js analytics widgets (borrow trends, member growth, fine summary, overdue gauge) |
| **PDF Report** | Overdue Books report (10+ days) generated server-side with PDFKit |
| **Themes** | 5 switchable UI themes (dark, light, indigo, emerald, ocean) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, React Router v7, Axios, Chart.js, Framer Motion, React Hook Form |
| Backend | Node.js, Express.js, JWT, bcryptjs, Multer, node-cron, PDFKit, Nodemailer |
| Database | MongoDB Atlas + Mongoose |
| Storage | Cloudinary (book covers + profile pictures) |
| Email | Gmail SMTP via Nodemailer |

---

## 👤 User Roles

- **Student** — Browse & search books, request borrows, reserve unavailable books, view own fines and history, OTP-based password reset.
- **Librarian** — Approve/reject borrow & return requests, process direct returns, manage inventory.
- **Admin** — Everything a Librarian can do + manage librarian accounts, configure fine settings, waive fines, download PDF report.

---

## 🚀 Getting Started

### 1. Clone
```bash
git clone <repo-url>
cd Library_Management_System
```

### 2. Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=<your_mongodb_atlas_uri>
DB_NAME=Library_MERN_Stack_DB
JWT_SECRET=<your_secret>
CLOUD_NAME=<cloudinary_name>
CLOUD_API_KEY=<cloudinary_key>
CLOUD_API_SECRET=<cloudinary_secret>
EMAIL_USER=<gmail_address>
EMAIL_PASS=<gmail_app_password>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Seed the admin user (run once):
```bash
node seedAdmin.js
```

Start the server:
```bash
npm run dev        # development
npm start          # production
```
> Runs on **http://localhost:5000**

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```
> Runs on **http://localhost:5173**

---

## 🌐 Live Demo

Live deployment link not found in the project files.

---

## 📂 Project Structure

```
Library_Management_System/
├── backend/
│   ├── controller/     # Business logic (admin, books, librarian, fines, reports…)
│   ├── routes/         # Express route definitions (8 modules)
│   ├── schemas/        # Mongoose schemas (8 collections)
│   ├── model/          # Mongoose model wrappers
│   ├── middlewares/    # JWT auth, role check, restriction check, account validity
│   ├── utils/          # Email service, Cloudinary config, cron jobs, fine calculator
│   └── index.js        # App entry point
└── frontend/
    ├── src/
    │   ├── pages/      # admin/, librarian/, user/, auth/ page components
    │   ├── components/ # Navbar, Footer, ProtectedRoute, ThemeSwitcher
    │   ├── layout/     # UserLayout, AdminLayout, AdminShell
    │   ├── context/    # Theme context
    │   └── utils/      # Auth helpers, API config, toast helpers
    └── index.html
```

---

## 📄 License

This project was developed as a Final Year Academic Project.
