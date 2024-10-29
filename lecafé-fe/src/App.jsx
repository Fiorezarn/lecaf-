import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import SendEmail from "./pages/SendEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Order from "./pages/Order";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/send-email" element={<SendEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="order" element={<Order />} />
      </Routes>
    </Router>
  );
}

export default App;
