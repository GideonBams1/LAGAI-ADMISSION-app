# UniApply — University Admissions & Recruiter Platform

A fully functional, free-to-deploy university admissions web app built with React, Tailwind CSS, and a localStorage-powered backend that is fully Supabase-ready.

---

## ✅ Features

| Portal | Features |
|---|---|
| **Student** | Register · Login · Browse Programmes · Multi-step Application Form · Document Upload · Track Status |
| **Recruiter** | Register (pending approval) · Submit for Students · Track Pipeline · View Commissions |
| **Admin** | Dashboard · Review Applications (Accept/Reject/Conditional) · Manage Programmes (CRUD) · Approve/Suspend Recruiters · Process Commissions |

---

## 🆓 100% Free Tech Stack

| Layer | Tool | Free Tier |
|---|---|---|
| Frontend | React 18 + Vite | Open source |
| Styling | Tailwind CSS | Open source |
| Icons | Lucide React | Open source |
| Routing | React Router v6 | Open source |
| Database (MVP) | localStorage | No server needed |
| Database (prod) | Supabase | Free tier (500MB, 50K users) |
| Auth (prod) | Supabase Auth | Free tier |
| File Storage (prod) | Supabase Storage | Free (1GB) |
| Hosting | Vercel | Free tier (unlimited deploys) |

---

## 🚀 Quick Start (5 minutes)

### 1. Install dependencies

```bash
cd university-app
npm install
```

### 2. Run the development server

```bash
npm run dev
```

The app will open at **http://localhost:5173**

### 3. Demo Accounts (pre-loaded)

| Role | Email | Password |
|---|---|---|
| Admin | admin@uniapply.com | admin123 |
| Student | student@demo.com | demo123 |
| Recruiter | recruiter@demo.com | demo123 |

---

## 🌐 Deploy to Vercel (Free)

### Option A — GitHub + Vercel (Recommended)

1. Push this folder to a **GitHub repository**
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repo
4. Click **Deploy** — that's it! ✅

Vercel auto-detects Vite and builds correctly.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🗄️ Upgrade to Real Backend (Supabase)

The app works without a backend using localStorage. When you're ready to go live with persistent data:

### Step 1 — Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → **New Project** (free)
2. Choose a region close to your users

### Step 2 — Run the schema

1. In your Supabase dashboard → **SQL Editor**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

### Step 3 — Add Supabase credentials

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Find these in: Supabase → Project Settings → API

### Step 4 — Install Supabase client

```bash
npm install @supabase/supabase-js
```

### Step 5 — Create `src/lib/supabase.js`

```js
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### Step 6 — Swap Context calls

Replace `localStorage` operations in `AuthContext.jsx` and `DataContext.jsx` with `supabase` calls. For example:

```js
// AuthContext login → replace with:
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// DataContext submitApplication → replace with:
const { data, error } = await supabase.from('applications').insert([appData])
```

---

## 📁 Project Structure

```
university-app/
├── src/
│   ├── App.jsx                    # Routes + role guards
│   ├── contexts/
│   │   ├── AuthContext.jsx         # Auth (login/register/logout)
│   │   └── DataContext.jsx         # Data (programs/applications/commissions)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx         # Role-aware sidebar nav
│   │   │   └── PageLayout.jsx      # Wrapper with sidebar
│   │   └── ui/
│   │       ├── StatusBadge.jsx     # Coloured status pills
│   │       └── Modal.jsx           # Reusable modal
│   ├── pages/
│   │   ├── Landing.jsx             # Public landing page
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Programs.jsx        # Browse + filter
│   │   │   ├── Apply.jsx           # 5-step wizard
│   │   │   └── Applications.jsx    # Track status
│   │   ├── recruiter/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Submit.jsx          # Submit for student
│   │   │   ├── Students.jsx
│   │   │   └── Commissions.jsx
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Applications.jsx    # Review + quick actions
│   │       ├── Programs.jsx        # Full CRUD
│   │       ├── Recruiters.jsx      # Approve/suspend + edit
│   │       └── Commissions.jsx     # Process payouts
│   └── index.css                  # Tailwind + custom components
├── supabase/
│   └── schema.sql                 # PostgreSQL schema + RLS policies
└── README.md
```

---

## 🔒 Data Flow & Storage

**MVP (localStorage):**
- All data stored in browser localStorage
- Persists across page refreshes
- Perfect for testing and demos
- `ua_users`, `ua_programs`, `ua_applications`, `ua_commissions`

**Production (Supabase):**
- Swap context functions with Supabase queries
- Files stored in Supabase Storage bucket
- Row-Level Security already defined in schema

---

## 📈 Future Enhancements

- [ ] Email notifications (Resend.com — free tier)
- [ ] Offer letter PDF generation
- [ ] Student payment integration (Stripe)
- [ ] Analytics dashboard (Plausible — open source)
- [ ] Multi-university support
- [ ] Scholarship tracking
- [ ] Interview scheduling

---

## 📄 License

MIT — free to use, fork, and deploy commercially.
