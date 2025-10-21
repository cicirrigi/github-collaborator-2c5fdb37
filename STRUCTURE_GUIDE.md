# 🏗️ VANTAGE LANE 2.0 – FRONTEND ARCHITECTURE GUIDE

> This document describes the **frontend architecture** of Vantage Lane 2.0 —  
> a modular Next.js + Supabase + Stripe + Tailwind system built for scalability, maintainability, and developer clarity.

## 📊 PROJECT STRUCTURE OVERVIEW

```
vantage-lane-2.0/
├── 📁 src/
│   ├── 🏠 app/                  # Next.js App Router (Pages & API Routes)
│   │   ├── api/                # API route handlers
│   │   ├── about/              # About page
│   │   ├── test-benefits/      # Test pages
│   │   └── test-button/        # Component testing pages
│   │
│   ├── 🎨 components/          # UI Library & Feature Components
│   │   ├── ui/                 # Atomic components (Button, Card, Input)
│   │   ├── shared/             # Reusable UI blocks with light logic
│   │   ├── features/           # Domain-based modular organization
│   │   │   ├── booking/        # Complete booking workflow
│   │   │   ├── account/        # User account management
│   │   │   ├── auth/           # Authentication flows
│   │   │   ├── payments/       # Payment processing
│   │   │   ├── search/         # Search functionality
│   │   │   ├── members/        # Membership features
│   │   │   ├── corporate/      # Corporate clients
│   │   │   └── landing/        # Landing page components
│   │   ├── layout/             # Structural components (Navbar, Footer)
│   │   ├── forms/              # Form-specific components
│   │   ├── providers/          # React Context providers
│   │   └── mobile/             # Mobile-specific components
│   │
│   ├── ⚙️ config/               # Configuration files
│   │   ├── content.config.ts   # Content & business configuration
│   │   ├── site.config.ts      # Site metadata & navigation
│   │   ├── theme.config.ts     # Theme & design token configuration
│   │   └── index.ts            # Configuration exports
│   │
│   ├── 🎨 design-system/       # Design System & Tokens
│   │   ├── tokens/             # Design tokens (colors, spacing, etc.)
│   │   └── components/         # Base design system components
│   │
│   ├── 📧 emails/               # Email templates & components
│   │   └── components/         # React email components
│   │
│   ├── 🚀 features/            # Feature modules (different from components/features/)
│   │   # Standalone feature implementations
│   │
│   ├── 🛠️ lib/                 # Pure logic & utilities
│   │   ├── utils/              # Helper functions (cn, formatters, validators)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── logger/             # Logging utilities
│   │   ├── monitoring/         # Sentry, error tracking
│   │   ├── constants.ts        # Application constants
│   │   ├── env.ts              # Environment configuration
│   │   ├── health.ts           # Health check system
│   │   └── utils.ts            # General utilities
│   │
│   ├── 🔗 providers/           # React Context providers & global state
│   │   # Theme providers, auth providers, etc.
│   │
│   ├── 🖥️ server/              # Server-side logic & backend utilities
│   │   ├── actions/            # Server actions
│   │   ├── middleware/         # Custom middleware
│   │   ├── services/           # Backend services
│   │   └── utils/              # Server utilities
│   │
│   ├── 🎨 styles/              # Global styles & CSS
│   │   ├── fonts/              # Custom fonts
│   │   ├── globals.css         # Global CSS & Tailwind imports
│   │   └── README.md           # Style system documentation
│   │
│   ├── 🧪 test/                # Test utilities & setup
│   │   # Testing configuration and utilities
│   │
│   └── 📝 types/               # TypeScript type definitions
│       ├── booking.ts          # Booking-related types
│       ├── user.ts             # User & authentication types
│       ├── invoice.ts          # Payment & billing types
│       └── global.ts           # Global type definitions
│
├── 📁 docs/                    # Documentation
├── 📁 scripts/                 # Build & quality scripts (AI Guardian, etc.)
├── 📁 sql/                     # Database schemas & migrations
├── 📁 public/                  # Static assets
└── 📄 Configuration files      # package.json, tsconfig.json, etc.
```

## 🎯 **Architecture Principles**

1. **Modular Design**: Each folder has a single, clear responsibility
2. **Co-location**: Related files are kept close together
3. **Scalability**: Structure supports both small and large features
4. **Type Safety**: Strong TypeScript support throughout
5. **Performance**: Optimized for Next.js App Router patterns

## 📚 **Key Differences**

- **`components/features/`** vs **`features/`**: Components are UI-focused, features/ contains business logic
- **`lib/`**: Pure utilities, no React dependencies
- **`providers/`**: React context and global state management
- **`server/`**: Server-side code (actions, middleware, services)
- **`config/`**: Centralized configuration management

> 💡 **Note**: This structure follows Next.js 13+ App Router conventions while maintaining clear separation of concerns.
