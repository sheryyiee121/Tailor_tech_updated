# Google Authentication Setup

This project now includes Firebase Google authentication. Here's how it's set up and how to use it.

## What's Been Added

1. **Firebase Configuration** (`src/firebase/config.js`)
   - Firebase app initialization
   - Google authentication provider setup
   - Analytics configuration

2. **Authentication Hook** (`src/hooks/useAuth.js`)
   - Google sign-in functionality
   - User state management
   - Sign-out functionality
   - Local storage persistence

3. **Updated Components**
   - Signin page with Google sign-in button
   - Signup page with Google sign-up button
   - UserProfile component for dashboard
   - Updated PrivateRoute with Firebase auth

4. **Context Provider** (`src/contexts/AuthContext.jsx`)
   - Global authentication state management

## Features

- **Google Sign-In/Sign-Up**: Users can authenticate using their Google accounts
- **Automatic Redirects**: Authenticated users are redirected to dashboard
- **User Profile Display**: Shows user avatar, name, and email in dashboard
- **Sign-Out Functionality**: Users can sign out from the dashboard
- **Protected Routes**: All dashboard routes require authentication
- **Persistent Sessions**: User sessions persist across browser refreshes

## How It Works

1. **Authentication Flow**:
   - User clicks "Continue with Google" button
   - Google OAuth popup opens
   - User selects their Google account
   - Firebase handles the authentication
   - User is redirected to dashboard

2. **Route Protection**:
   - PrivateRoute component checks Firebase auth state
   - Unauthenticated users are redirected to signin page
   - Authenticated users can access protected routes

3. **User State Management**:
   - Firebase auth state is monitored globally
   - User information is stored in localStorage for persistence
   - User profile is displayed in dashboard sidebar

## Usage

### For Users
1. Navigate to `/signin` or `/signup`
2. Click "Continue with Google" button
3. Select your Google account
4. You'll be automatically signed in and redirected to dashboard

### For Developers
1. The `useAuth` hook provides authentication functions
2. `signInWithGoogle()` handles Google authentication
3. `signOutUser()` handles user sign-out
4. User state is available via the `user` object

## Security Features

- Firebase handles all OAuth security
- User tokens are managed securely by Firebase
- No sensitive data is stored in localStorage
- Protected routes prevent unauthorized access

## Dependencies Added

- `firebase`: Core Firebase SDK
- Firebase Authentication for Google OAuth
- Firebase Analytics for usage tracking

## Configuration

The Firebase configuration is already set up with your project credentials in `src/firebase/config.js`. Make sure your Firebase project has Google authentication enabled in the Firebase Console.

## Troubleshooting

- If Google sign-in fails, check that Google authentication is enabled in Firebase Console
- Ensure your domain is added to authorized domains in Firebase
- Check browser console for any authentication errors
- Verify that popup blockers aren't blocking the Google OAuth popup
