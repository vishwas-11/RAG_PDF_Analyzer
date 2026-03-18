// import LandingPage from "./components/LandingPage";

// function App() {
//   return (
//     <>
//       <LandingPage />
//     </>
//   );
// }

// export default App;





import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import AuthPage from "./components/AuthPage";
import DotGrid from "./components/DotGrid";

// A simple wrapper to protect the Dashboard route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // If no token exists, send them to the login page
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#05010d] text-slate-200 overflow-x-hidden">
        
        {/* Global Background Layer 
            This stays fixed in the background across all routes
        */}
        <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
          <DotGrid 
            dotSize={2} 
            gap={35} 
            baseColor="#2e1065" 
            activeColor="#a855f7" 
            proximity={150} 
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10">
          <Routes>
            {/* Public Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Login / Signup Page */}
            <Route path="/auth" element={<AuthPage />} />

            {/* Protected Dashboard 
                Only accessible if localStorage has a valid JWT token
            */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Fallback: Redirect any unknown path to Landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;