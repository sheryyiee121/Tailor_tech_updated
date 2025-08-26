// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";

// Pages
import Signup from "./pages/authentication/signup/Signup";
import Home from "./pages/home/Home";
import Signin from "./pages/authentication/singin/Signin";
import Dashboard from "./pages/dashboard/dashboard";
import Texture from "./pages/model/Texture";
import Model from "./pages/model/model";
import Animation from "./pages/model/animation";
import SearchResults from "./pages/search/SearchResults";
import CustomOrderFixed from "./pages/order/CustomOrderFixed";

// PrivateRoute Component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />

          {/* Protected Dashboard Page Only */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Protected Full Pages */}
          <Route
            path="/texture"
            element={
              <PrivateRoute>
                <Texture />
              </PrivateRoute>
            }
          />
          <Route
            path="/model"
            element={
              <PrivateRoute>
                <Model />
              </PrivateRoute>
            }
          />
          <Route
            path="/animation"
            element={
              <PrivateRoute>
                <Animation />
              </PrivateRoute>
            }
          />
          <Route
            path="/search-results"
            element={
              <PrivateRoute>
                <SearchResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/custom-order"
            element={
              <PrivateRoute>
                <CustomOrderFixed />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
