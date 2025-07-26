# 🖨️ PaperSprint

**Instant document print & delivery service.** Upload files, customize print settings, and get your papers delivered — in minutes.

> ⚡ Built using **React + Node.js + Flask** • Designed for real-time performance and convenience

## 🏆 About the Project

This project was built for **Innovatex 2025**, a hackathon organized by the **TSEC AI&DS Department**.
> 🥉 Placed **3rd out of 65+ teams** in the final round.

## 👥 Company 8

Built by a passionate team of undergrads:

* 🧠 **Omar Rakhe** – [@rakheOmar](https://github.com/rakheOmar)
* 🔧 **Tejas Sidhwani** – [@TejasS1233](https://github.com/TejasS1233)
* 🎨 **Yash Singrodia** – [@Yash19075](https://github.com/Yash19075)
* 🔍 **Raj Telang** – [@TelangRaj](https://github.com/TelangRaj)

## 👨‍💻 Built With

- ⚛️ React (Vite)
- 🖼️ TailwindCSS + DaisyUI + ShadCN
- 🌐 Express.js (v5)
- 🍃 MongoDB + Mongoose
- 🍶 Flask
- 📄 PDF-lib for file manipulation
- ☁️ Cloudinary for uploads
- 💳 Razorpay for payments
- 🗺️ Leaflet for delivery location



## 📁 Project Structure

```bash
papersprint/
├── client/       # React frontend
└── server/       # Node.js backend
````



## 🎯 Features

* 🔐 User authentication with JWT
* ⭐ Secure passwords using bcrypt
* 📤 Drag-and-drop file uploads
* 📄 Live PDF preview
* ✂️ Page range selection
* 🎨 Print settings (color, double-side, binding, etc.)
* 📍 Address picker with interactive map
* 💳 Secure online payments via Razorpay
* 🚚 Courier interface for real-time order delivery
* 🧾 Order summary + cost breakdown
* 👨 Admin and Partner panel
* 🤖 AI Assistant

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/rakheOmar/print-sprint-2.0
cd print-sprint-2.0
```

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

### 3. Start the backend

```bash
cd server
npm install
npm run dev
```

## 🔐 Frontend `.env` Setup

Create a `.env` file in the `/client` directory:

```env
GROQ_API_KEY=grok_api_key
VITE_API_BASE_URL=your_server_base_url
```

## 🔐 Backend `.env` Setup

Create a `.env` file in the `/server` directory:

```env
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```


