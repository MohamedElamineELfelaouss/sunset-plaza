# 🌅 Sunset Plaza - Premium Real Estate Management System

![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-Proprietary-orange?style=for-the-badge)

**Sunset Plaza** is a sophisticated, AI-driven real estate platform designed to streamline property management and enhance the user experience for prospective buyers and renters. It merges a high-performance **Django REST Framework** backend with a modern, responsive **Next.js 16** frontend.

The platform distinguishes itself with deep AI integration: a **Gemini-powered Chatbot** that intelligently categorizes user queries and handles sales pitches, and an **Automated Content Translation System** that breaks down language barriers for international listings.

---

## 🚀 Key Features

### 🤖 Intelligent AI Chatbot
- **Gemini Engine**: Powered by Google's Gemini API for natural, context-aware conversations.
- **Smart Categorization**: Automatically detects user intent (Pricing, Investment, Support) and tags interactions.
- **Sales Intelligence**: Identifies high-value "Sales Pitch" opportunities and dynamically triggers booking forms.
- **Confidence Scoring**: Tracks AI confidence levels for quality assurance and analytics.

### 🌍 Multilingual Content Management (CMS)
- **One-Click Translation**: Integrated auto-translation pipeline using DeepL and Google Translate APIs.
- **Language Support**: Native support for **French (Source), English, and Arabic (RTL)**, expandable to 7+ languages (ES, NL, DE, IT, PT).
- **Batch Processing**: Select multiple property listings in the admin panel and translate them simultaneously with real-time progress tracking.
- **Status Indicators**: Visual cues (🌐) instantly identify translated vs. untranslated inventory.

### 🛡️ Robust Admin Dashboard
- **Modern UI/UX**: Built with **Tailwind CSS v4** and **Radix UI** for a premium, accessible feel.
- **Media Management**: Advanced image handler supporting drag-and-drop uploads, reordering, and "Set Main Image" functionality.
- **Role-Based Access**: Secure JWT authentication with distinct roles for Admin and Visitors.
- **Real-Time Analytics**: Dashboard widgets for monitoring chatbot interactions and content engagement.

### ⚡ Performance & Architecture
- **Next.js 16 (App Router)**: Leverages Server Components and Server Actions for optimal performance and SEO.
- **Django 6.0**: Uses the latest Django features for a secure, scalable API foundation.
- **Type Safety**: End-to-end type safety with TypeScript and Zod validation schemas.

---

## 🛠️ Technology Stack

### Backend Infrastructure
| Component | Technology | Description |
|-----------|------------|-------------|
| **Core** | **Django 6.0** | High-level Python web framework |
| **API** | **Django REST Framework** | Powerful toolkit for Web APIs |
| **Database** | **SQLite / PostgreSQL** | Flexible data storage options |
| **Auth** | **SimpleJWT** | JSON Web Token authentication |
| **AI** | **Google Generative AI** | Gemini API for chatbot logic |
| **I18n** | **Django-Modeltranslation** | Database-level translation storage |
| **Utils** | **DeepL & Deep-Translator** | Translation services integration |

### Frontend Application
| Component | Technology | Description |
|-----------|------------|-------------|
| **Framework** | **Next.js 16** | React framework for production |
| **Library** | **React 19** | Latest UI library features |
| **Language** | **TypeScript** | Static typing for reliability |
| **Styling** | **Tailwind CSS v4** | Utility-first CSS framework |
| **Animation** | **Framer Motion** | Production-ready animation library |
| **Components** | **Radix UI** | Unstyled, accessible UI primitives |
| **State** | **TanStack Query** | Asynchronous state management |
| **Icons** | **Lucide React** | Beautiful & consistent open-source icons |

---

## 🏁 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **Python**: v3.10 or higher
- **API Keys**: Google Gemini API Key & DeepL API Key

### 1️⃣ Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment
python -m venv venv

# 3. Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install python dependencies
pip install -r requirements.txt

# 5. Run database migrations
python manage.py migrate

# 6. Create a superuser for Admin Panel access
python manage.py createsuperuser

# 7. Start the development server
python manage.py runserver
```

### 2️⃣ Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install node dependencies
npm install

# 3. Start the Next.js development server
npm run dev
```

The app will be available at `http://localhost:3000` and the API at `http://localhost:8000`.

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend` directory with the following keys. **Do not commit this file.**

```env
# Django Security
SECRET_KEY=your_django_secret_key_here
DEBUG=True

# AI Services
GOOGLE_API_KEY=your_gemini_api_key_here
DEEPL_API_KEY=your_deepl_api_key_here

# Database (Optional - defaults to SQLite)
# DB_NAME=sunset_plaza
# DB_USER=...
```

---



## 📂 Project Structure

```
sunset-plaza/
├── backend/                # Django API
│   ├── apps/               # Modular Django apps
│   │   ├── analytics/      # Data tracking
│   │   ├── chatbot/        # Gemini AI logic
│   │   ├── contacts/       # Form submissions
│   │   ├── content/        # Listings & Translations
│   │   └── users/          # Auth & Profiles
│   ├── config/             # Project settings
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # Next.js App
    ├── app/                # App Router pages
    │   ├── admin/          # Protected Dashboard routes
    │   └── (public)/       # Public landing pages
    ├── components/         # Reusable UI components
    └── public/             # Static assets
```

---

## 🤝 Contributing

We welcome contributions to Sunset Plaza!

1. **Fork** the repository.
2. Create a new branch: `git checkout -b feature/NewFeature`.
3. Commit your changes: `git commit -m 'Add new feature'`.
4. Push to the branch: `git push origin feature/NewFeature`.
5. Submit a **Pull Request**.

---

## 📞 Contact

**Project Maintenance**: [MohamedElamineELfelaouss](https://github.com/MohamedElamineELfelaouss)
**Repository**: [sunset-plaza](https://github.com/MohamedElamineELfelaouss/sunset-plaza)
