import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-b from-white to-cyan-600">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={user ? <Navigate to="/main" /> : <RegisterPage />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/main" /> : <LoginPage />}
        />
        <Route
          path="/main"
          element={user ? <MainPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/main" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
