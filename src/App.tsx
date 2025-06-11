import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import MainPage from "./components/MainPage";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
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
  );
};

export default App;
