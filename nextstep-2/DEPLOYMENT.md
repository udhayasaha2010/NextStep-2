# Deployment Guide for NextStep 2.0

This guide provides step-by-step instructions to deploy the NextStep 2.0 platform to production.

## 🚀 Architecture Overview
- **Frontend**: Next.js (App Router) deployed on Vercel.
- **Backend/Database**: Supabase (PostgreSQL) with Row Level Security (RLS).
- **Authentication**: Google OAuth via Supabase Auth.
- **PWA**: Service Worker and Web App Manifest for installable mobile experience.

---

## 🛠️ Step 1: Supabase Setup

### 1. Create Project
- Create a new project at [supabase.com](https://supabase.com).
- Save your **Project URL** and **Anon Key**.

### 2. Initialize Database
- Navigate to the **SQL Editor** in the Supabase dashboard.
- Copy the contents of `supabase/migrations/001_initial_schema.sql` from this repository.
- Paste and run the script to create all tables, constraints, and RLS policies.

### 3. Configure Google Authentication
- Go to **Authentication** $\rightarrow$ **Providers** $\rightarrow$ **Google**.
- Enter your `Client ID` and `Client Secret` (obtained from the Google Cloud Console).
- **Critical**: Copy the **Redirect URI** provided by Supabase and add it to your Google Cloud Console under "Authorized redirect URIs".

---

## 🌐 Step 2: Vercel Deployment

### 1. Import Repository
- Log in to [vercel.com](https://vercel.com) using GitHub.
- Click **Add New** $\rightarrow$ **Project** $\rightarrow$ Import `udhayasaha2010/NextStep-2`.

### 2. Configure Environment Variables
Add the following keys in the Vercel project settings:

| Variable | Description | Source |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Settings $\rightarrow$ API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key | Supabase Settings $\rightarrow$ API |
| `SUPABASE_SERVICE_ROLE_KEY` | Your secret service role key | Supabase Settings $\rightarrow$ API |
| `GOOGLE_CLIENT_ID` | Google Cloud Client ID | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Client Secret | Google Cloud Console |
| `NEXT_PUBLIC_APP_URL` | Your final Vercel URL | Vercel Dashboard |

### 3. Deploy
- Click **Deploy**. Vercel will build the project and provide you with a production URL.

---

## 📱 Step 3: PWA & Offline Verification

Once the site is live:
1. Visit the production URL on a mobile browser (Chrome or Safari).
2. You should see an "Add to Home Screen" prompt.
3. To test offline mode:
   - Load the dashboard while online.
   - Turn on Airplane Mode.
   - Refresh the page; you should see the custom `/offline` fallback page.

## 🛡️ Security Checklist
- [ ] Ensure `SUPABASE_SERVICE_ROLE_KEY` is NEVER exposed in client-side code.
- [ ] Verify that RLS policies are active for all tables in Supabase.
- [ ] Confirm that the Google OAuth redirect URI exactly matches the Supabase settings.
