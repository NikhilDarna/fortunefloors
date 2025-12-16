import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostProperty from './pages/PostProperty';
import AdminDashboard from './pages/AdminDashboard';
import PropertyDetails from './pages/PropertyDetails';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider } from "./components/wishlistcontext";
import GoogleSuccess from './pages/SocialLoginSuccess';
import SubscriptionPlans from "./pages/SubscriptionPlans";
import WishlistPage from "./pages/WishlistPage";
import FeaturePlans from "./pages/FeaturePlans";
import AllProperties from "./pages/allpropertiespage";
import ForgotPassword from './pages/ForgotPassword';
import PostBlogs from './pages/PostBlogs';
import Blogs from './pages/Blogs';
import SingleBlogs from './pages/SingleBlogs';
import EditBlogs from "./pages/EditBlogs";
import PropertyMapPage from "./pages/PropertyMapPage";
import PropertyExpo from "./pages/PropertyExpo";



import './App.css';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post-property"
                element={
                  <ProtectedRoute>
                    <PostProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route path="/property/:slug" element={<PropertyDetails />} />
              <Route path="/subscription" element={<SubscriptionPlans />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/feature-plans" element={<FeaturePlans />} />
              <Route path="/all-properties" element={<AllProperties />} />
              <Route path="/ForgotPassword" element={<ForgotPassword />} />
              <Route path="/social-login-success" element={<GoogleSuccess />} />
              <Route path="/property-expo" element={<PropertyExpo />} />
              <Route path="/map" element={<PropertyMapPage />} />
              <Route path="/admin/post-blogs" element={<PostBlogs />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:slug" element={<SingleBlogs />} />
              <Route path="/admin/edit-blog/:id" 
              element={<ProtectedRoute><EditBlogs /></ProtectedRoute>} />
            </Routes>

            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

export default App;