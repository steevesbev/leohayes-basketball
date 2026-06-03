# 🦅 Leo Hayes Varsity Girls Basketball — Team Portal

A full-stack team management portal with email login, JWT authentication, and admin user management.

---

## Tech Stack

| Layer    | Tech                         |
|----------|------------------------------|
| Frontend | React 18, React Router 6     |
| Backend  | Node.js / Express            |
| Database | SQLite (better-sqlite3)      |
| Auth     | JWT + bcrypt                 |
| Deploy   | Railway                      |

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/leohayes-basketball.git
cd leohayes-basketball

# Install all dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Configure backend environment

```bash
cp backend/.env.example backend/.env
# Edit backend/.env and set:
# JWT_SECRET = a long random string
# ADMIN_EMAIL = your admin email
# ADMIN_PASSWORD = your admin password
```

### 3. Run in development

**Terminal 1 — API:**
```bash
cd backend && npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend && npm start
# Runs on http://localhost:3000
```

### 4. Default admin credentials

On first launch, an admin account is auto-created using values from `.env`:
- **Email:** admin@leohayes.ca (or your `ADMIN_EMAIL`)
- **Password:** LeoHawks2025! (or your `ADMIN_PASSWORD`)

**Change the admin password immediately after first login.**

---

## Deploy to Railway

### Step 1 — Push to GitHub

```bash
cd /path/to/leohayes-basketball
git init
git add .
git commit -m "Initial commit — Leo Hayes Basketball Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/leohayes-basketball.git
git push -u origin main
```

### Step 2 — Deploy on Railway

1. Go to [railway.app](https://railway.app) and log in
2. Click **New Project → Deploy from GitHub repo**
3. Select `leohayes-basketball`
4. In the Railway dashboard, go to **Variables** and add:

| Variable          | Value                                    |
|-------------------|------------------------------------------|
| `NODE_ENV`        | `production`                             |
| `JWT_SECRET`      | (generate a long random string)          |
| `ADMIN_EMAIL`     | your admin email                         |
| `ADMIN_PASSWORD`  | your admin password                      |
| `FRONTEND_URL`    | your Railway domain (added after deploy) |

5. Railway will build and deploy automatically
6. Copy your Railway domain (e.g. `https://leohayes-basketball.up.railway.app`)
7. Update `FRONTEND_URL` variable with that domain
8. **Redeploy** for the change to take effect

---

## Features

- ✅ Email + password login (JWT)
- ✅ Protected routes (member and admin)
- ✅ Admin user management (add, edit, disable, delete)
- ✅ Password change (self-service)
- ✅ SQLite database (no external DB required)
- ✅ Auto-seeds admin account on first run
- ✅ Prevents accidental last-admin deletion

---

## Project Structure

```
leohayes-basketball/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express entry point
│   │   ├── db.js             # SQLite init + seed
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT middleware
│   │   └── routes/
│   │       ├── auth.js       # Login, me, change-password
│   │       └── admin.js      # User CRUD (admin only)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── styles.css
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── components/
│   │   │   └── Layout.js
│   │   └── pages/
│   │       ├── LoginPage.js
│   │       ├── DashboardPage.js
│   │       ├── AccountPage.js
│   │       └── AdminPage.js
│   └── package.json
├── railway.toml
├── nixpacks.toml
└── README.md
```
