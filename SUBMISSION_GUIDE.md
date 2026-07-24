# 🚀 KSP Crime Intelligence Platform — Submission Guide

## 1. GitHub Repository Setup

### Option A: Command Line Push (Recommended)
1. Go to [github.com/new](https://github.com/new) and create a public repository named `ksp-crime-intelligence-platform`.
2. Run these commands in terminal:

```bash
cd "C:\Users\grao3\Downloads\New folder\ksp"
git remote add origin https://github.com/YOUR_USERNAME/ksp-crime-intelligence-platform.git
git branch -M main
git push -u origin main
```

**Submission GitHub Link:**
`https://github.com/YOUR_USERNAME/ksp-crime-intelligence-platform`

---

## 2. Zoho Catalyst Deployment Guide

Zoho Catalyst provides **Web Client Hosting** for single-page applications and serverless web apps.

### Step 1: Install Catalyst CLI
```bash
npm install -g zcatalyst-cli
```

### Step 2: Login to Catalyst Account
```bash
catalyst login
```

### Step 3: Initialize Catalyst Project
```bash
cd "C:\Users\grao3\Downloads\New folder\ksp"
catalyst init
```
- Select **Client** (Web Client Hosting).
- Set source folder to `frontend/dist` (production build generated via `npm run build`).

### Step 4: Deploy Project
```bash
catalyst deploy
```

### Live Catalyst URL Format:
`https://<project-name>.catalystserver.com`

---

## 🔑 Demo Accounts for Submission

| Role | Username | Password |
|------|----------|----------|
| **Analyst** | `analyst` | `Analyst@123` |
| **Admin** | `admin` | `Admin@123` |
| **Viewer** | `viewer` | `Viewer@123` |
