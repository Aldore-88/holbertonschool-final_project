# 🌸 Flora - Flowers Marketplace

**Team:** Anthony, Bevan, Xiaoling, and Lily | **Holberton Final Project**

_Flora - Where every purchase blooms into joy_ 🌸

<br>

<div align="center">
  <img src="docs/images/flora-hero.png" alt="Flora Marketplace Screenshot" width="100%" />
</div>

<br>

Flora is a modern flowers and plants marketplace featuring flexible purchasing options including one-time purchases and subscription services. Built with React + TypeScript, Node.js/Express, Prisma, PostgreSQL, and Docker.

---

## 📸 Demo

### 🌐 Live Application

**👉 [https://flora-4h2n.onrender.com](https://flora-4h2n.onrender.com)** - Deployed on Render

_⏱️ First load may take 30-60 seconds as the backend wakes from idle state_

**Try these features:**

- 🔍 Search with auto-suggestions (try "rose" or "lily")
- 🎨 Filter products by color, mood, occasion, or price
- 🛒 Add items to cart and explore guest checkout
- 🔐 Login with Google to try subscription features
- 📅 Schedule deliveries for different dates
- 🤖 Generate AI-powered gift messages

<!-- Add screenshots/GIFs here after deployment -->

---

## ✨ Features

### Core Shopping Experience

- 🛍️ **Product Browsing** - Intelligent Search and Multi-Criteria Filtering
- 🎁 **Guest Checkout** - No account required for one-time purchases
- 🔐 **User Authentication** - Secure login with Auth0 (email/password + Google)
- 🤖 **AI Gift Messages** - Generate personalized messages with Gemini AI based on keywords and tone

### Purchase Options

- **One-Time Purchase** - Single delivery with instant checkout
- **Recurring Subscription** - Regular deliveries (weekly/fortnightly/monthly) with savings
- **Spontaneous Subscription** - Surprise deliveries at random times with frequency of weekly/fortnightly/monthly.

### 💳 Checkout & Delivery

- **Stripe Payment Integration** - Secure payment processing with multiple payment methods
- **Flexible Delivery Scheduling** - Choose different dates for each item with smart shipping breakdown
- **Melbourne Metro Coverage** - 100+ postcodes with validation (expansion-ready infrastructure)
- **Order Confirmation** - Detailed summary page with automated email notifications

### User Account Management

- 📊 **Profile Dashboard** - View orders, subscriptions, and total spending
- 📦 **Order History** - Browse past purchases with pagination
- ⚙️ **Subscription Control** - Pause, resume, or cancel active subscriptions

---

## 🛠️ Tech Stack

**Frontend**

- React 19 + TypeScript
- Vite (development & build tool)
- Auth0 (authentication)
- Custom CSS styling

**Backend**

- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL
- Auth0 JWT authentication
- Stripe payment processing
- Email service integration

**DevOps**

- Docker containerization
- pnpm workspaces (monorepo)
- GitHub Actions CI/CD
- 80 automated tests with Jest

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           User's Browser                            │
│                         http://localhost:5173                       │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ HTTP Requests
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                     │
├─────────────────────────────────────────────────────────────────────┤
│  • React 19 + TypeScript                                            │
│  • Product Browsing & Shopping Cart                                 │
│  • Checkout & Subscription Management                               │
│  • Auth0 Integration (JWT tokens)                                   │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ REST API Calls
                                 │ (JWT Authentication)
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   Backend API (Node.js + Express)                   │
├─────────────────────────────────────────────────────────────────────┤
│  • Express Routes & Controllers                                     │
│  • Business Logic & Services                                        │
│  • JWT Middleware (Auth0 verification)                              │
│  • Order Processing & Subscription Management                       │
└──────┬──────────┬──────────┬──────────┬──────────┬─────────────────┘
       │          │          │          │          │
       ▼          ▼          ▼          ▼          ▼
  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
  │ Auth0  │ │ Stripe │ │ Email  │ │Gemini  │ │PostgreSQL│
  │  JWT   │ │Payment │ │Service │ │   AI   │ │ Database │
  └────────┘ └────────┘ └────────┘ └────────┘ └────┬─────┘
                                                     │
                                                     │ Prisma ORM
                                                     ▼
                                            ┌────────────────┐
                                            │  Database      │
                                            ├────────────────┤
                                            │ • Users        │
                                            │ • Products     │
                                            │ • Orders       │
                                            │ • Subscriptions│
                                            │ • Payments     │
                                            └────────────────┘
```

**Key Data Flows:**

1. **Authentication:** User login → Auth0 → JWT token → Frontend → Backend validates JWT
2. **Shopping:** Browse products → Add to cart → Checkout → Stripe payment → Create order
3. **Subscriptions:** Choose subscription options (Recurring or Spontaneous) with frequency → Schedule recurring orders → Check and manage subscriptions in My Subscriptions page
4. **Orders:** Process payment → Save to database → Send confirmation email

---

## 📁 Project Structure

```
holbertonschool-final_project/
├── apps/
│   ├── frontend/              # React + TypeScript + Vite
│   │   ├── src/
│   │   │   ├── components/    # Reusable UI components
│   │   │   ├── pages/         # Page components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   └── services/      # API communication
│   │   └── package.json
│   └── backend/               # Node.js + Express API
│       ├── src/
│       │   ├── controllers/   # HTTP request handlers
│       │   ├── services/      # Business logic
│       │   ├── routes/        # API endpoints
│       │   ├── middleware/    # Auth, validation
│       │   └── config/        # Configuration
│       ├── prisma/
│       │   ├── schema.prisma  # Database schema
│       │   └── seed.ts        # Sample data
│       └── package.json
├── docs/                      # Documentation
├── .github/workflows/         # CI/CD automation
└── docker-compose*.yml        # Docker configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Docker Desktop** (recommended) or Node.js 18+
- **pnpm** package manager: `npm install -g pnpm`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Aldore-88/holbertonschool-final_project.git
cd holbertonschool-final_project

# 2. Build Docker containers (first time only)
pnpm docker:dev:build

# 3. Setup database (migrations + sample data)
pnpm docker:setup

# 4. Start development servers (in background)
pnpm docker:dev:bg
```

### Access the Application

- **Frontend:** http://localhost:5173
  (_Check frontend logs: `docker logs flora-frontend` or `pnpm docker:logs frontend --tail 10`_)
- **Backend API:** http://localhost:3001 (_Check backend logs:
  `docker logs flora-backend --tail 10` or `pnpm docker:logs backend --tail 5`_)
- **Health Check:** http://localhost:3001/api/health
- **Database GUI:** Run `npx prisma studio`

### Environment Setup

Create `.env` files in both `apps/frontend/` and `apps/backend/` directories. See `.env.example` files for required variables.

**Key environment variables:**

- Auth0 credentials (Domain, Client ID, Audience)
- Database connection string
- Stripe API keys
- Email service credentials

---

## 🧪 Running Tests

```bash
# Run all backend tests
docker exec flora-backend pnpm test

# Run specific test suites
docker exec flora-backend pnpm test:auth
docker exec flora-backend pnpm test:order
docker exec flora-backend pnpm test:payment

# View test coverage
docker exec flora-backend pnpm test:coverage
```

**All tests must pass before merging to main.** CI/CD pipeline automatically runs tests on every push.

---

## 📚 Documentation

Detailed guides for development, testing, and database management:

- **[Docker Setup Guide](docs/DOCKER_GUIDE.md)** - Daily workflow, Docker commands, troubleshooting
- **[Database Guide](docs/DATABASE.md)** - Prisma migrations, schema changes, seeding
- **[Testing and CI/CD Guide](docs/TESTING_GUIDE.md)** - Comprehensive testing documentation, CI/CD pipeline

---

## 🚀 Future Development

Features planned for post-graduation development:

**User Experience Enhancements:**

- 📱 Mobile responsive design
- 👤 User preferences and saved favorites
- 📦 Advanced delivery tracking system
- ⭐ Product reviews and ratings

**Platform Features:**

- 🛠️ Admin dashboard for platform management
- 🏪 Seller dashboard for vendor management
- 🤖 AI-powered product description generator for sellers

---

## 👥 Team

_Flora Team:_

- **Bevan** - [GitHub](https://github.com/Aldore-88)
- **Anthony**
- **Xiaoling**
- **Lily**

---

## 📄 License

MIT License - This project is for educational and demonstration purposes.

---

**Holberton School Final Project | Flora Team | 2025**
