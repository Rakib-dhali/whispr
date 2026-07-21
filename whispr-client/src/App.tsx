import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useEffect } from "react";
import { useAuthStore } from "./lib/useAuthStore.ts";
import Chat from "./components/Chat.tsx";
import Loader from "./components/Loader.tsx";

const App = () => {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={authUser ? <Chat /> : <Home />} />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to={"/"} />}
          />
          <Route
            path="/signup"
            element={!authUser ? <Signup /> : <Navigate to={"/"} />}
          />
        </Routes>
      </Router>
      <Toaster />
    </div>
  );
};

export default App;
