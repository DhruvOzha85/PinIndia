import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import PincodeLookup from "./pages/PincodeLookup";
import DistanceCalculator from "./pages/DistanceCalculator";
import About from "./pages/About";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/explore" element={<PageTransition><Explore /></PageTransition>} />
        <Route path="/pincode" element={<PageTransition><PincodeLookup /></PageTransition>} />
        <Route path="/distance" element={<PageTransition><DistanceCalculator /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-16 min-h-screen">
        <AnimatedRoutes />
      </main>
    </BrowserRouter>
  );
}
