import { BrowserRouter, Route, Routes } from "react-router-dom";

import ModerationPanel from "./src/components/ModerationPanel";
import About from "./src/pages/About";
import Main from "./pages/Main";
import LoginForm from "./src/pages/auth/LoginForm";
import { RegisterForm } from "./src/pages/auth/RegisterForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main></Main>}>
          <Route index element={<ModerationPanel />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
