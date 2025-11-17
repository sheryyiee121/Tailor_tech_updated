# 🎨 TailorTech - AI-Powered Fashion Design Platform

A modern web application that combines AI technology with custom fashion design, featuring an admin dashboard for managing users and orders.

---

## ✨ Features

### For Users:
- 🔐 Firebase Authentication (Email/Password & Google Sign-In)
- 🎨 AI-Powered Design Generation
- 👔 Custom Order Submission
- 📏 Body Measurement Tools
- 👗 3D Model Visualization
- 🎭 Virtual Try-On

### For Admins:
- 👥 User Management (View all users, Block/Unblock)
- 📦 Order Management (View orders, Update status)
- 📊 Dashboard Statistics
- 📧 View All User Emails
- 📥 Export Data to CSV
- 🔍 Search & Filter Capabilities

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- .NET 8 SDK
- Visual Studio 2022 or VS Code

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Tailor_tech.git
   cd tailortech
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Configure admin email**
   
   Edit `src/config/adminConfig.js`:
   ```javascript
   export const ADMIN_EMAILS = [
       'youremail@gmail.com',  // Add your email here
   ];
   ```

4. **Start the backend**
   ```bash
   cd TailorTechAPI
   dotnet restore
   dotnet run
   ```
   
   Backend will start on: `http://localhost:5001`

5. **Start the frontend** (in new terminal)
   ```bash
   npm run dev
   ```
   
   Frontend will start on: `http://localhost:5173`

---

## 🎯 Usage

### For Regular Users:
1. Sign up at `/signup`
2. Sign in at `/signin`
3. Access dashboard at `/dashboard`
4. Submit custom orders at `/custom-order`

### For Admins:
1. Sign in with admin email (configured in `adminConfig.js`)
2. Click "Admin Panel" in dashboard sidebar
3. Access:
   - `/admin` - Dashboard with statistics
   - `/admin/users` - User management
   - `/admin/orders` - Order management

---

## 🏗️ Tech Stack

### Frontend:
- React 19
- Vite
- React Router
- Tailwind CSS
- Firebase Authentication
- Three.js / React Three Fiber
- Framer Motion

### Backend:
- .NET 8 Web API
- Entity Framework Core
- SQLite Database
- Swagger/OpenAPI

---

## 📁 Project Structure

```
tailortech/
├── src/
│   ├── pages/
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── authentication/     # Sign in/Sign up
│   │   ├── dashboard/          # User dashboard
│   │   ├── order/              # Order forms
│   │   └── model/              # 3D model pages
│   ├── components/             # Reusable components
│   ├── contexts/               # React contexts
│   ├── services/               # API services
│   ├── config/                 # Configuration files
│   └── firebase/               # Firebase config
│
└── TailorTechAPI/              # .NET Backend
    ├── Controllers/            # API endpoints
    ├── Models/                 # Database models
    ├── Services/               # Business logic
    ├── Data/                   # Database context
    └── tailortech.db          # SQLite database
```

---

## 🔧 Configuration

### Admin Configuration

Edit `src/config/adminConfig.js` to add admin emails:

```javascript
export const ADMIN_EMAILS = [
    'admin@example.com',
    'youremail@gmail.com',
];
```

### Backend API URL

Default: `http://localhost:5001/api`

To change, edit `src/config/adminConfig.js`:

```javascript
export const API_BASE_URL = 'http://your-backend-url/api';
```

### Firebase Configuration

Firebase config is in `src/firebase/config.js` (already configured).

---

## 📊 Database

### Location
`TailorTechAPI/tailortech.db`

### Tables
- **Users**: Firebase users synced to backend
- **Orders**: Custom design orders

### Viewing Database
Use [DB Browser for SQLite](https://sqlitebrowser.org/) to view/edit the database.

---

## 🧪 Testing

### Test Backend API
Open Swagger UI: `http://localhost:5001/swagger`

### Test Admin Features
1. Sign in as admin
2. Submit a test order
3. Check `/admin/orders` to see it
4. Try blocking a user
5. Export data to CSV

---

## 📝 API Endpoints

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create/update user
- `PUT /api/users/{id}/block` - Block/unblock user

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}/status` - Update order status

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (admin view)
- `GET /api/admin/orders` - Get all orders (admin view)

---

## 🚢 Deployment

### Frontend
Deploy to Vercel, Netlify, or any static hosting:
```bash
npm run build
# Deploy the dist/ folder
```

### Backend
Deploy to:
- Azure App Service (Recommended for .NET)
- Railway
- Render

Don't forget to:
1. Update CORS settings with production URL
2. Update `API_BASE_URL` in frontend
3. Use environment variables for sensitive data

---

## 📚 Additional Documentation

- `ADMIN_DASHBOARD_GUIDE.md` - This file
- `TailorTechAPI/README.md` - Backend API documentation
- `GOOGLE_AUTH_SETUP.md` - Firebase authentication setup
- `COMPLETE_GOOGLE_SETUP.md` - Complete Google auth guide

---

## 🎉 Features Summary

### ✅ Working Features:
- User authentication (Email/Password & Google)
- Custom order submission
- Admin dashboard with statistics
- User management (view, block/unblock)
- Order management (view, update status)
- Email list viewing
- CSV export
- Search and filter
- Role-based access control

---

## 🔐 Security

- Admin access controlled by email whitelist
- Firebase handles authentication
- Protected routes for admin pages
- CORS configured for security
- SQLite database for data persistence

---

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check backend logs in Visual Studio
3. Verify both servers are running
4. Check admin email configuration

---

## 👨‍💻 Development

### Run in Development Mode

**Terminal 1 - Backend:**
```bash
cd TailorTechAPI
dotnet watch run
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Build for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
cd TailorTechAPI
dotnet publish -c Release
```

---

## 📄 License

This project is part of an FYP (Final Year Project).

---

**Built with ❤️ using React, .NET, and Firebase**
