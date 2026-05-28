# ZRP — Zambia Real Estate Platform

A modern web platform where customers can browse property listings and connect with verified real estate agents across Zambia.

> **Status:** Frontend Phase 1 — in active development

---

## Overview

ZRP is being built in two phases. The current focus is building a complete, polished frontend that defines the full product flow, user experience, and feature set. Once the frontend is satisfying, the backend will be built using the frontend as a blueprint.

The platform serves three user roles:

- **Customer** — browse listings, save properties, contact agents, send inquiries
- **Agent** — manage listings, track inquiries, maintain a public profile
- **Admin** — verify agents, moderate listings, review reports

---

## Tech Stack

### Frontend (current phase)
| Tool | Purpose |
|------|---------|
| React | UI framework |
| Vite | Build tool and dev server |
| React Router | Client-side routing |

### Backend (Phase 2)
| Tool | Purpose |
|------|---------|
| Node.js + Express | REST API |
| PostgreSQL | Database |
| JWT + bcrypt | Authentication |

### Deployment (planned)
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render / Railway | Backend hosting |
| Supabase / Neon | Hosted PostgreSQL |

---

## Pages

### Public Pages (Samuel)
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, featured listings, featured agents, CTAs |
| Listings | `/listings` | Browse all listings with search and filters |
| Property Details | `/listings/:id` | Full property info, images, agent contact |
| Agent Directory | `/agents` | Browse agents with search, location, and verification filters |
| Agent Profile | `/agents/:id` | Full agent profile with listings and contact |
| Login | `/login` | Email and password login |
| Register | `/register` | Role-based registration (Customer or Agent) |
| Customer Dashboard | `/customer-dashboard` | Saved properties, inquiry history, account settings |

### Dashboard Pages (Masiye)
| Page | Route | Description |
|------|-------|-------------|
| Agent Dashboard | `/agent-dashboard` | Agent's listings, inquiries, profile management |
| Add Listing | `/add-listing` | Create a new property listing |
| Edit Listing | `/edit-listing` | Edit an existing listing |
| Admin Dashboard | `/admin-dashboard` | Platform stats, pending verifications, flagged content |
| Verification Review | `/verification-review` | Review and approve/reject agent submissions |
| Reports | `/reports` | View and manage user-submitted reports |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ListingCard.jsx
│   ├── AgentCard.jsx
│   ├── VerifiedBadge.jsx
│   ├── DashboardSidebar.jsx
│   └── FormInput.jsx
├── pages/
│   ├── Home.jsx
│   ├── Listings.jsx
│   ├── PropertyDetails.jsx
│   ├── AgentDirectory.jsx
│   ├── AgentProfile.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── CustomerDashboard.jsx
│   ├── AgentDashboard.jsx
│   ├── AddListing.jsx
│   ├── EditListing.jsx
│   ├── AdminDashboard.jsx
│   ├── VerificationReview.jsx
│   └── Reports.jsx
├── data/
│   ├── mockListings.js
│   ├── mockAgents.js
│   └── mockUsers.js
├── hooks/
│   └── useListingForm.js
└── App.jsx
```

---

## Design System

### Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| Primary | `#0F172A` | Navbar, headings, buttons, footer |
| Accent | `#C29A4B` | Badges, highlights, CTAs, agent names |
| Background | `#F8FAFC` | Page backgrounds, input fields |
| Card | `#FFFFFF` | Cards, forms, dashboards |
| Text Primary | `#0F172A` | Main body text |
| Text Secondary | `#64748B` | Labels, metadata, descriptions |
| Success | `#22C55E` | Verified badge, approved status |
| Error | `#EF4444` | Validation errors, warnings |

### Typography
- **Headings** — Poppins
- **Body** — Inter

### Layout
- Max container width: `1200px`
- Border radius: `8px` (buttons), `12px` (cards), `16px` (modals/auth cards)
- Card shadow: `0px 4px 12px rgba(0, 0, 0, 0.08)`

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Samuelzulu/zambia-real-estate-platform.git
cd zambia-real-estate-platform

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Branching Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable, reviewed code |
| `feature/public-pages-samuel` | Samuel's public-facing pages |
| `feature/dashboard-pages-masiye` | Masiye's dashboard pages |

Before starting work each session:

```bash
git checkout main
git pull origin main
git checkout feature/your-branch
git merge main
```

---

## Work Split

**Samuel** — Home, Listings, PropertyDetails, AgentDirectory, AgentProfile, Login, Register, CustomerDashboard, ListingCard, AgentCard, SearchBar, FilterPanel, VerifiedBadge

**Masiye** — Register, AgentDashboard, AddListing, EditListing, AdminDashboard, VerificationReview, Reports, DashboardSidebar, FormInput

---

## Phase 2 — Backend (planned)

Once the frontend is complete, backend development will follow this order:

1. Project setup — Node.js, Express, environment config
2. Database — PostgreSQL schema and models
3. Authentication — registration, login, JWT, bcrypt
4. User roles — customer, agent, admin
5. Agent profiles — details, agency, ZIEA registration, verification status
6. Listings CRUD — create, edit, delete, fetch
7. Inquiry system — customer contacts agent, stored in DB
8. Favorites — customers save listings
9. Admin verification workflow — approve/reject agents
10. Reports system — users report listings or agents

---

## License

This project is for portfolio and educational purposes.