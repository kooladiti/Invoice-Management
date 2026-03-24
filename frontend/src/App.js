import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import NavbarTop from "./NavbarTop";
import Footer from "./Footer";
import Dashboard from "./pages/Dashboard";
import Team from "./pages/Team";
import Course from "./pages/Course";
import Invoice from "./pages/Invoice";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>

      <NavbarTop theme={theme} setTheme={setTheme} />

      <div className="main-layout">
        <Sidebar />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/course" element={<Course />} />
            <Route path="/invoice" element={<Invoice />} />
          </Routes>
        </div>
      </div>

      <Footer />

    </BrowserRouter>
  );
}

export default App;