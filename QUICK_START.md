# Quick Start Guide

## Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Step 2: Setup MongoDB

Make sure MongoDB is running:
- **Local MongoDB**: Start MongoDB service
- **MongoDB Atlas**: Get your connection string

## Step 3: Configure Environment

Create `backend/.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/temple_management
JWT_SECRET=your_very_secure_secret_key_here
PORT=5000
```

Create `frontend/.env` file (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Step 4: Create Admin User

Option 1: Using the script:
```bash
node backend/scripts/createAdmin.js admin admin123
```

Option 2: Using API (after starting server):
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Step 5: Start the Application

```bash
# Start both servers
npm run dev

# OR start separately:
# Terminal 1: npm run server
# Terminal 2: npm run client
```

## Admin login (not visible to normal users)

The **Admin** link is **not shown** on the website so normal visitors cannot see it.

**To log in as admin**, use this URL (bookmark it or save it):

- **Local:** `http://localhost:3000/admin/login`
- **Production:** `https://your-domain.com/admin/login`

Use the **username and password** you created in Step 4. After login you can change settings, manage content, and manage tokens from the admin panel.
You can also open **`/admin/profile`** from the dashboard to change the admin username or password securely after logging in.

## Step 6: Access the Application

- **User Website**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
  - Username: admin
  - Password: admin123 (or what you set)

## Step 7: Initial Setup (Admin)

1. Login to admin panel
2. Go to "Manage Home Page" and add:
   - Temple name
   - Banners (image URLs)
   - Welcome message
   - Announcements
3. Go to "Manage Poojas" and add your poojas
4. Go to "Manage Map" and set:
   - Temple address
   - Latitude and Longitude (get from Google Maps)
5. Go to "Manage About" and add temple information
6. Go to "Manage Contact" and add contact details

## Troubleshooting

**MongoDB Connection Error:**
- Check if MongoDB is running
- Verify MONGODB_URI in .env file

**Port Already in Use:**
- Change PORT in backend/.env
- Or kill the process using the port

**CORS Errors:**
- Make sure backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env

**Module Not Found:**
- Run `npm install` in both root and frontend directories

## Next Steps

- Get Google Maps API key for map functionality
- Configure image upload for banners and poojas
- Customize colors and styling
- Add more features as needed

