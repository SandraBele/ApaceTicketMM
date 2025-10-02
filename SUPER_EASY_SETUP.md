# ApaceTicket - Super Easy Setup for Non-Coders

## Option 1: One-Click Cloud Setup (EASIEST - Recommended)

### Using GitHub Codespaces (FREE)
1. **Go to GitHub**: Visit https://github.com/SandraBele/ApaceTicket
2. **Click the Green "Code" Button** 
3. **Select "Codespaces" Tab**
4. **Click "Create Codespace"** (this gives you a free cloud computer)
5. **Wait 2-3 minutes** for setup to complete
6. **In the terminal window that appears, copy and paste this single command:**
   ```bash
   docker compose -f infra/docker-compose.yml up -d
   ```
7. **Wait 1 minute**, then click the "Ports" tab at the bottom
8. **Click the globe icon** next to port 3000
9. **Done!** The app opens in your browser

**Cost**: FREE (GitHub gives you 60 hours/month free)
**Time**: 5 minutes total
**Technical Skills**: None required

---

## Option 2: Desktop App (Docker Desktop)

### Step 1: Download Docker Desktop
- **Windows**: Go to https://docker.com → Download Docker Desktop
- **Mac**: Go to https://docker.com → Download Docker Desktop  
- **Install it** (just click Next → Next → Install like any app)

### Step 2: Get the Code
- Go to https://github.com/SandraBele/ApaceTicket
- Click the green **"Code"** button → **"Download ZIP"**
- **Extract the ZIP file** to your Desktop

### Step 3: Run the App
- **Open Docker Desktop** (wait for it to start - whale icon will be still)
- **Open Command Prompt/Terminal:**
  - **Windows**: Press Windows key + R → type `cmd` → Enter
  - **Mac**: Press Cmd + Space → type `terminal` → Enter
- **Navigate to the folder** (replace "USERNAME" with your username):
  ```bash
  cd Desktop/ApaceTicket-main
  ```
- **Start the application**:
  ```bash
  docker compose -f infra/docker-compose.yml up -d
  ```
- **Open your browser** and go to: http://localhost:3000

**Time**: 10 minutes total
**Technical Skills**: Basic computer use

---

## Option 3: Cloud Deploy (Most Permanent)

### Railway (Recommended Cloud Platform)
1. **Go to**: https://railway.app
2. **Sign up** with GitHub (free account)
3. **Click "Deploy from GitHub"**
4. **Connect your GitHub** and select "SandraBele/ApaceTicket"
5. **Railway will auto-detect** Docker and deploy everything
6. **Get your live URL** in 5-10 minutes

**Cost**: Free tier available, ~$5/month for continuous use
**Time**: 15 minutes setup
**Result**: Permanent URL you can access anytime

---

## Login Credentials (For All Options)

Once the app is running, use these accounts:

### 🔑 Admin (Full Access)
- **Email**: admin@apace.local
- **Password**: admin123

### 👥 Other Roles
- **Support**: support@apace.local / support123
- **Business Dev**: bd@apace.local / bd123456  
- **Management**: mgmt@apace.local / mgmt123
- **Product Dev**: productdev@apace.local / productdev123

---

## What You'll See

### Admin Dashboard Features:
✅ **User Management** - Create users, assign roles, manage accounts  
✅ **Team Management** - Set up teams, assign KPIs, configure SLA defaults  
✅ **Ticket Oversight** - View all tickets, advanced filtering, bulk operations  
✅ **Reporting** - Generate reports, export to CSV/PDF  
✅ **Email Notifications** - Send bulk emails, notification center  
✅ **Invoice Management** - Track invoices, payment status, financial reports  
✅ **System Settings** - Customize dashboards, security controls  
✅ **Audit Logs** - Complete action history and security monitoring  

---

## Quick Troubleshooting

### If nothing appears:
1. **Wait 2-3 minutes** (services need time to start)
2. **Check Docker Desktop** - all containers should be green/running
3. **Try refreshing** your browser
4. **Check the URL** is exactly: http://localhost:3000

### If login doesn't work:
- **Double-check** you're using: admin@apace.local / admin123
- **Make sure** the email includes ".local" at the end

### Need help?
- **GitHub Codespaces** is the easiest option if you're not technical
- **Everything runs in the cloud** - no installation needed on your computer
- **Completely free** for the first 60 hours each month

---

## Recommendation for Non-Coders

**Go with Option 1 (GitHub Codespaces)** - it's:
- ✅ Completely free to try
- ✅ No downloads or installations  
- ✅ Works on any computer with internet
- ✅ No technical knowledge required
- ✅ Ready in under 5 minutes

Just click, wait, and use!