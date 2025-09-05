// App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "./contexts/AuthContext";

// Pages
import SignupRedesigned from "./pages/authentication/signup/SignupRedesigned";
import Home from "./pages/home/Home";
import Signin from "./pages/authentication/singin/Signin";
import Dashboard from "./pages/dashboard/dashboard";
import Texture from "./pages/model/Texture";
import Model from "./pages/model/model";
import Animation from "./pages/model/animation";
import SearchResults from "./pages/search/SearchResults";
import CustomOrderFixed from "./pages/order/CustomOrderFixed";

// Solutions Pages
import EnterpriseSuite from "./pages/solutions/EnterpriseSuite";
import SmallBusiness from "./pages/solutions/SmallBusiness";

// Use Cases Pages
import Ecommerce from "./pages/usecases/Ecommerce";
import Education from "./pages/usecases/Education";

// Pricing Pages
import Plans from "./pages/pricing/Plans";

// About Pages
import OurTeam from "./pages/about/OurTeam";

// PrivateRoute Component
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupRedesigned />} />
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

          {/* Public Pages - Solutions */}
          <Route path="/solutions/enterprise" element={<EnterpriseSuite />} />
          <Route path="/solutions/small-business" element={<SmallBusiness />} />

          {/* Public Pages - Use Cases */}
          <Route path="/use-cases/ecommerce" element={<Ecommerce />} />
          <Route path="/use-cases/education" element={<Education />} />

          {/* Public Pages - Pricing */}
          <Route path="/pricing" element={<Plans />} />

          {/* Public Pages - About */}
          <Route path="/about/team" element={<OurTeam />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
