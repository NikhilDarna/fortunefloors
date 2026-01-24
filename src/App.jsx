import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PostProperty from './pages/PostProperty';
import HowItWorks from './pages/HowItWorks';
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
import BuildSite from "./pages/BuildSite";
import TestimonialsPage from "./pages/TestimonialsPage";
import Profile from "./pages/Profile";
import ManageAccount from "./pages/ManageAccount";
import Shortlists from "./pages/Shortlists";
import OwnersContacted from "./pages/OwnersContacted";
import Payments from "./pages/Payments";
import MyProperties from "./pages/MyProperties";
import CityPage from "./pages/citypages";
import FilteredProperties from "./pages/FilteredProperties";
import AboutUs from "./pages/AboutUs";
import Services from "./pages/Services";
import Properties from "./pages/Properties";
import Contact from "./pages/Contact";
import AddProperty from "./pages/AddProperty";
import MyListing from "./pages/MyListing";
import Favorites from "./pages/Favorites";
import Support from "./pages/Support";
import HowItWork from "./pages/HowItWork";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import OurPartners from "./pages/OurPartners";
import FAQPage from "./pages/FAQPage";
import PricingGuide from "./pages/PricingGuide";
import DocumentsNeeded from "./pages/DocumentsNeeded";
import Agents from "./pages/Agents";
import AgentReviews from "./pages/AgentReviews";
import './components/BottomNav';
import InteriorDetails from "./pages/InteriorDetails";
import MobileFilterPage from "./pages/MobileFilterPage";
import './App.css';
import BottomNav from './components/BottomNav';
import AdviceAndTools from "./pages/AdviceAndTools";
import AreaConverter from "./pages/AreaConverter";
import EMICalculator from "./pages/EMICalculator";
import HomeLoanOffers from "./pages/HomeLoanOffers";
import BuilderProperties from "./pages/BuilderProperty";
import Interiors from './pages/Interiors';


function ScrollToTop() {
  const { pathname } = useLocation();
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
 
  return (
    <AuthProvider>
      <WishlistProvider>
        <Router>
          <div className="App">
            <ScrollToTop />
            <Navbar />
            <BottomNav />

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
              <Route path="/area-converter" element={<AreaConverter />} />
              <Route path="/emi-calculator" element={<EMICalculator />} />
              <Route path="/home-loan-offers" element={<HomeLoanOffers />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:slug" element={<SingleBlogs />} />
              <Route path="/advice-tools" element={<AdviceAndTools />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/services" element={<Services />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/add-property"
                element={
                  <ProtectedRoute>
                    <AddProperty />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-listing"
                element={
                  <ProtectedRoute>
                    <MyListing />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route path="/support" element={<Support />} />
              <Route path="/how-it-work" element={<HowItWork />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/partners" element={<OurPartners />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/pricing-guide" element={<PricingGuide />} />
              <Route path="/documents-needed" element={<DocumentsNeeded />} />
              <Route path="/agents/:type" element={<Agents />} />
              <Route path="/account" element={<Navigate to="/dashboard" />} />
              <Route path="/agent/:id/reviews" element={<AgentReviews />} />

              <Route
                path="/admin/edit-blog/:id" 
                element={<ProtectedRoute><EditBlogs /></ProtectedRoute>} />
              <Route path="/build-site" element={<BuildSite />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />
              <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
              <Route path="/account/shortlists" element={<ProtectedRoute><Shortlists /></ProtectedRoute>} />

              <Route path="/account/manage" element={<ProtectedRoute><ManageAccount /></ProtectedRoute>} />
              <Route path="/account/shortlists" element={<ProtectedRoute><Shortlists /></ProtectedRoute>} />
              <Route path="/account/owners" element={<ProtectedRoute><OwnersContacted /></ProtectedRoute>} />
              <Route path="/account/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
              <Route path="/account/properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
              <Route path="/city/:cityName" element={<CityPage />} />
              <Route path="/filter/:filterType/:value?" element={<FilteredProperties />} />
              <Route path="/filters" element={<MobileFilterPage />} />
              <Route path="/interior/:slug" element={<InteriorDetails />} />
              <Route path="/builder-properties" element={<BuilderProperties />} />
              <Route path="/interiors" element={<Interiors />} />




            </Routes>
            

            {window.location.pathname !== "/filters" && <Footer />}


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