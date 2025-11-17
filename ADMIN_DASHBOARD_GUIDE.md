# 🎯 TailorTech Admin Dashboard - Complete Guide

## 📋 Overview

This admin dashboard allows you to:
- View all registered users with their emails
- Block/unblock users
- View all custom design orders
- Update order status
- Export data to CSV
- View statistics

---

## 🚀 Quick Start

### 1. Configure Admin Email

Edit `src/config/adminConfig.js`:

```javascript
export const ADMIN_EMAILS = [
    'jeeu7786@gmail.com',  // Your admin email
    // Add more admin emails here
];
```

### 2. Start Backend

**In Visual Studio:**
- Click Green Play button ▶️
- Wait for: `Now listening on: http://localhost:5001`

**Or in Terminal:**
```bash
cd TailorTechAPI
dotnet run
```

### 3. Start Frontend

```bash
npm run dev
```

### 4. Access Admin Panel

1. Sign in with your admin email (`jeeu7786@gmail.com`)
2. Look for "Admin Panel" button in dashboard sidebar
3. Or navigate to: `http://localhost:5173/admin`

---

## 📊 Features

### Admin Dashboard (`/admin`)
- Total users count
- Total orders count
- Pending orders count
- Blocked users count
- Quick action buttons

### Users Management (`/admin/users`)
- View all user emails
- Display names and profile pictures
- Block/unblock users
- Search by email or name
- Filter by status (active/blocked)
- Export to CSV

### Orders Management (`/admin/orders`)
- View all custom design orders
- Order ID, customer info, design type
- Update order status (pending/processing/completed/cancelled)
- View detailed order information
- Search by order ID, customer name, or email
- Filter by status
- Export to CSV

---

## 🔧 Technical Details

### Architecture

```
Frontend (React + Vite) → Port 5173
    ↓
Firebase Auth (User Authentication)
    ↓
Backend API (.NET 8) → Port 5001
    ↓
SQLite Database (tailortech.db)
```

### Data Flow

**User Registration:**
1. User signs in with Firebase
2. User opens dashboard
3. After 2 seconds → Auto-sync to backend (once per session)
4. User saved to SQLite database
5. Admin can view in `/admin/users`

**Order Submission:**
1. User fills order form at `/custom-order`
2. Submits order
3. POST to `/api/orders`
4. Backend generates OrderId and saves to database
5. Admin can view in `/admin/orders`

### Database Schema

**Users Table:**
- Id, Uid (Firebase), Email, DisplayName, PhotoURL
- IsBlocked, CreatedAt, LastLoginAt

**Orders Table:**
- Id, OrderId, UserId, CustomerName, CustomerEmail
- Phone, DesignType, Measurements (JSON)
- ShippingAddress (JSON), SpecialInstructions
- GeneratedImage, TotalAmount, Status
- CreatedAt, UpdatedAt

---

## 🎯 Admin Access Control

Only emails in `ADMIN_EMAILS` array can:
- See "Admin Panel" button in sidebar
- Access `/admin` routes
- View user and order data
- Block/unblock users
- Update order status

Non-admin users are automatically redirected to regular dashboard.

---

## 🧪 Testing

### Test User Sync:
1. Create new account
2. Sign in and wait on dashboard for 3 seconds
3. Check console: "User synced with backend"
4. Sign in as admin and check `/admin/users`

### Test Order Submission:
1. Sign in as regular user
2. Go to `/custom-order`
3. Fill and submit form
4. Sign in as admin
5. Check `/admin/orders` - order should appear

### Test Block User:
1. Go to `/admin/users`
2. Click "Block" on a user
3. Status changes to "Blocked"

### Test Order Status Update:
1. Go to `/admin/orders`
2. Click "View" on an order
3. Change status dropdown
4. Status updates in database

---

## 🐛 Troubleshooting

### Admin panel shows empty stats
- **Check:** Backend is running on port 5001
- **Check:** Swagger UI works at `http://localhost:5001/swagger`
- **Fix:** Restart backend in Visual Studio

### Can't access admin panel
- **Check:** Your email is in `ADMIN_EMAILS` array
- **Check:** You're signed in with that exact email
- **Fix:** Sign out and sign in again

### Orders not showing
- **Check:** Backend is running
- **Check:** Browser console for errors
- **Fix:** Refresh page (Ctrl + R)

### Port conflicts
- Backend uses port 5001
- Frontend uses port 5173
- Make sure nothing else uses these ports

---

## 📁 Important Files

**Frontend:**
- `src/config/adminConfig.js` - Admin email configuration
- `src/pages/admin/` - Admin dashboard components
- `src/services/userSyncService.js` - User sync logic

**Backend:**
- `TailorTechAPI/Program.cs` - API configuration
- `TailorTechAPI/Controllers/` - API endpoints
- `TailorTechAPI/Models/` - Database models
- `TailorTechAPI/Services/` - Business logic
- `TailorTechAPI/tailortech.db` - SQLite database file

---

## 🎉 System Features

- ✅ Firebase Authentication integration
- ✅ SQLite database for data persistence
- ✅ Auto-sync users on dashboard load
- ✅ Real-time order submission
- ✅ Admin role-based access control
- ✅ CSV export functionality
- ✅ Search and filter capabilities
- ✅ Order status management
- ✅ User blocking system

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check backend logs in Visual Studio
3. Verify both servers are running
4. Check `adminConfig.js` for correct email

---

**Everything is set up and working!** 🚀

