# TailorTech Backend API

.NET 8 Web API with SQLite database for TailorTech application.

## Features

- **User Management**: Track all Firebase authenticated users
- **Order Management**: Handle custom design orders
- **Admin Dashboard**: Statistics and management endpoints
- **SQLite Database**: Lightweight, file-based database
- **CORS Enabled**: Works with React frontend

## Prerequisites

- .NET 8 SDK
- Visual Studio 2022 or VS Code with C# extension

## Setup Instructions

### 1. Install .NET 8 SDK

Download from: https://dotnet.microsoft.com/download/dotnet/8.0

### 2. Restore Dependencies

```bash
cd TailorTechAPI
dotnet restore
```

### 3. Run the API

```bash
dotnet run
```

The API will start on: `http://localhost:5000`

Swagger UI will be available at: `http://localhost:5000/swagger`

### 4. Database

The SQLite database (`tailortech.db`) will be created automatically on first run in the project directory.

## API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/uid/{uid}` - Get user by Firebase UID
- `POST /api/users` - Create or update user
- `PUT /api/users/{id}/block` - Block/unblock user
- `DELETE /api/users/{id}` - Delete user

### Orders

- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/user/{userId}` - Get orders by user ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status` - Update order status
- `DELETE /api/orders/{id}` - Delete order

### Admin

- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users (admin view)
- `GET /api/admin/orders` - Get all orders (admin view)

## Database Schema

### Users Table
- Id (Primary Key)
- Uid (Firebase UID, Unique)
- Email (Unique)
- DisplayName
- PhotoURL
- IsBlocked
- CreatedAt
- LastLoginAt

### Orders Table
- Id (Primary Key)
- OrderId (Unique, Auto-generated)
- UserId (Firebase UID)
- CustomerName
- CustomerEmail
- Phone
- DesignType
- Measurements (JSON)
- SpecialInstructions
- ShippingAddress (JSON)
- GeneratedImage
- TotalAmount
- Status (pending/processing/completed/cancelled)
- CreatedAt
- UpdatedAt

## Configuration

Edit `appsettings.json` to change:
- Database connection string
- Logging levels
- Other settings

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)

To add more origins, edit `Program.cs`:

```csharp
policy.WithOrigins("http://localhost:5173", "http://localhost:3000", "YOUR_URL")
```

## Development

### Add Migrations (if using EF migrations)

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Build for Production

```bash
dotnet publish -c Release
```

## Troubleshooting

### Port Already in Use

Change the port in `Properties/launchSettings.json` or use:

```bash
dotnet run --urls "http://localhost:5001"
```

### Database Locked

Close any database browser tools that might have the database file open.

### CORS Errors

Make sure your frontend URL is added to the CORS policy in `Program.cs`.

## Testing

Test the API using:
- Swagger UI: `http://localhost:5000/swagger`
- Postman
- curl commands

Example curl command:

```bash
curl -X GET http://localhost:5000/api/users
```

## Deployment

For production deployment, consider:
- Azure App Service
- Railway
- Render
- Any .NET hosting provider

Make sure to:
1. Update CORS origins for production URLs
2. Use environment variables for sensitive data
3. Enable HTTPS
4. Configure proper logging

