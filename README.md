# 🌅 Sunset Plaza - Premium Real Estate Management System

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-Private-orange)

**Sunset Plaza** is a state-of-the-art real estate management platform designed for premium property listings. It features a stunning, responsive frontend built with **Next.js** and a robust, scalable backend powered by **Django REST Framework**.

What sets Sunset Plaza apart is its **AI-driven Admin Panel**, capable of instantly translating property details into 7+ languages, ensuring global reach with zero friction.

---

## 🚀 Key Features

### 🧠 AI-Powered Multilingual Support
- **Auto-Translation**: Instantly translate listings from French to **English, Arabic, Spanish, Dutch, German, Italian, and Portuguese**.
- **Hybrid Engine**: Utilizes **DeepL API** for European languages and **Google Translate** for Arabic to ensure maximum accuracy.
- **Batch Processing**: Select multiple listings and translate them all in one click with real-time progress tracking.
- **Visual Feedback**: visual indicators (🌐) for translated listings and smart status badges.

### 🎨 Modern Admin Dashboard
- **Sleek UI/UX**: Built with **Tailwind CSS**, featuring glassmorphism effects, dark mode aesthetics, and smooth transitions.
- **Media Management**: Drag-and-drop image uploads, instant reordering, and "Set as Main" functionality without page reloads.
- **Real-time Updates**: Immediate visual feedback for all CRUD operations.
- **Smart Filtering**: Filter by status (Published/Draft), view listings in grid layout, and manage content efficiently.

### ⚡ Technical Excellence
- **Frontend**: Next.js 14 (App Router), TypeScript, Framer Motion, Lucide React.
- **Backend**: Django 5.0, Django REST Framework, django-modeltranslation.
- **Performance**: Optimized image delivery, server-side rendering (SSR), and fast API response times.

---

## 🛠️ Technology Stack

### Frontend
- ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) **Next.js 14**
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) **TypeScript**
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS**
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React**

### Backend
- ![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white) **Django**
- ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) **Python 3.12**
- ![DRF](https://img.shields.io/badge/Django_REST-ff1744?style=flat&logo=django&logoColor=white) **DRF**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white) **PostgreSQL** (Recommended)

---

## 📸 Screenshots

*(Add your screenshots here)*
- **Admin Dashboard**: Grid view of listings with status badges.
- **Translation Modal**: Interface for auto-translating content.
- **Listing Details**: High-fidelity property showcase.

---

## 🏁 Getting Started

### Prerequisites
- Node.js > 18.x
- Python > 3.10
- DeepL API Key (for translations)

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Environment Variables

Create a `.env` file in the `backend` directory:

```env
SECRET_KEY=your_secret_key
DEBUG=True
DEEPL_API_KEY=your_deepl_api_key
```

---

## 🤖 API Documentation

The backend provides a comprehensive REST API. Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/api/schema/swagger-ui/`
- **Redoc**: `http://localhost:8000/api/schema/redoc/`

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Contact

**Project Link**: [https://github.com/MohamedElamineELfelaouss/sunset-plaza](https://github.com/MohamedElamineELfelaouss/sunset-plaza)
