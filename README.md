# Booking App

A modern web application for booking and managing meeting rooms, built with React and Firebase.

## 🚀 Key Features

- **User Authentication**: Secure login and registration.
- **Room Management**: Admins can create, edit, and delete meeting rooms.
- **Booking System**: Users can book available rooms for specific time slots.
- **Booking Conflict Detection**: Prevents overlapping bookings for the same room.
- **Participants Management**: Add participants to meetings by email.
- **Role-Based Access**: Admins have full control; users can manage their own bookings and add participants.
- **Responsive UI**: Clean, modern interface with mobile support.

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/booking-app.git
   cd booking-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore and Authentication (Email/Password).
   - Copy your Firebase config and replace the placeholder in `src/firebase/firebase.ts`:
     ```typescript
     // src/firebase/firebase.ts
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       // ...other config
     };
     ```

4. **Set Firestore Security Rules**

   - Use the provided rules in your Firestore console for secure access.

5. **Start the development server**

   ```bash
   npm start
   ```

6. **Open in your browser**
   ```
   http://localhost:3000
   ```

## 📚 Usage

- **Admins** can manage rooms and all bookings.
- **Users** can book rooms, view their bookings, and add participants to their meetings.
- **Participants** receive access to meetings they are added to.

## 📂 Project Structure

```
src/
  components/      # React components
  firebase/        # Firebase config and services
  hooks/           # Custom React hooks
  pages/           # Page components (MainPage, etc.)
  types/           # TypeScript types
```

**Enjoy using Booking App!**
