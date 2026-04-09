# 🚀 START HERE - Temple Management System

## Quick Start (3 Steps)

### Step 1: Verify Setup
Double-click **`verify-setup.bat`** to check if everything is ready.

### Step 2: Start the Application
Double-click **`start-all.bat`** to start both servers.

### Step 3: Access the Application
- **User Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Username: `admin`
  - Password: `admin123`

---

## 📁 Batch Files Available

| File | Purpose |
|------|---------|
| **start-all.bat** | ⭐ Start both servers (Recommended) |
| start-backend.bat | Start only backend server |
| start-frontend.bat | Start only frontend server |
| install-dependencies.bat | Install all dependencies |
| verify-setup.bat | Check if setup is complete |

---

## ✅ What's Included

### User Features
- ✅ Home page with temple info and announcements
- ✅ About page with temple history and timings
- ✅ Poojas page - browse and select poojas
- ✅ Token generation with QR codes
- ✅ Map & Location page
- ✅ Contact & Help page

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ Manage home page content
- ✅ Manage poojas (add/edit/delete)
- ✅ Manage tokens (view/verify/mark used)
- ✅ Manage map location
- ✅ Manage about page
- ✅ Manage contact information

---

## 🔧 Configuration

**Database**: `temple_management` (mongodb://localhost:27017/temple_management)
- Make sure MongoDB is running (check MongoDB Compass)
- Database will be created automatically when you first use the app

**Ports**:
- Backend: 5000
- Frontend: 3000

**Admin Account**:
- Username: `admin`
- Password: `admin123`
- ⚠️ Change password after first login!

---

## 🐛 Troubleshooting

### Servers won't start?
1. Run `verify-setup.bat` to check for issues
2. Run `install-dependencies.bat` to install dependencies
3. Make sure MongoDB is running

### Frontend shows "react-scripts not found"?
- The package.json uses `npx react-scripts` which will auto-download
- If still having issues, run: `cd frontend && npm install react-scripts@5.0.1 --save-dev`

### MongoDB connection error?
- Make sure MongoDB is running
- Check MongoDB Compass can connect
- Verify the database name in `backend\.env` matches your MongoDB database

### Port already in use?
- Change PORT in `backend\.env` for backend
- Change port in `frontend\package.json` scripts for frontend

---

## 📖 Next Steps After Starting

1. **Login to Admin Panel**: http://localhost:3000/admin/login
2. **Configure Home Page**:
   - Add temple name and logo
   - Add banners (image URLs)
   - Add announcements
3. **Add Poojas**:
   - Go to "Manage Poojas"
   - Add your poojas with names, timings, and prices
4. **Set Map Location**:
   - Go to "Manage Map"
   - Add temple address and coordinates (get from Google Maps)
5. **Add About Content**:
   - Go to "Manage About"
   - Add temple history, timings, rules, festivals
6. **Update Contact Info**:
   - Go to "Manage Contact"
   - Add phone, email, office timings

---

## 📝 Files Created

- ✅ All backend routes and models
- ✅ All frontend pages and components
- ✅ Database models (User, Pooja, Token, etc.)
- ✅ Authentication system
- ✅ QR code generation
- ✅ Batch files for easy startup

---

## 🎉 Everything is Ready!

Just double-click **`start-all.bat`** and you're good to go!

For detailed documentation, see `README.md` and `QUICK_START.md`

