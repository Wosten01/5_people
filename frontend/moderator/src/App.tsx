import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavigationMenu from "./components/NavMenu";
import { AuthProvider } from "./pages/auth/AuthContext";
import Main from "./pages/Main";
import { RegisterForm } from "./pages/auth/RegisterForm";
import LoginForm from "./pages/auth/LoginForm";
import ModerationPanel from "./pages/ModerationPanel";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationMenu />
        <Routes>
          <Route path="/" Component={Main} />
          <Route path="/register" Component={RegisterForm} />
          <Route path="/login" Component={LoginForm} />
          <Route path="/panel" Component={ModerationPanel} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
