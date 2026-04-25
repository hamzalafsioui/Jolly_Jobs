import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import authApi from "./api/auth.api";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TrustedCompanies from "./components/TrustedCompanies";
import BrowseCategories from "./components/BrowseCategories";
import FeaturedJobs from "./components/FeaturedJobs";
import HowItWorks from "./components/HowItWorks";
import SuccessStories from "./components/SuccessStories";
import LargeFooter from "./components/LargeFooter";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleCallback from "./pages/GoogleCallback";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import SavedJobs from "./pages/SavedJobs";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterLayout from "./components/RecruiterLayout";
import Profile from "./pages/Profile";
import PostJob from "./pages/recruiter/PostJob";
import EditJob from "./pages/recruiter/EditJob";
import MyJobs from "./pages/recruiter/MyJobs";
import Candidates from "./pages/recruiter/Candidates";
import JobSeekerProfile from "./pages/recruiter/JobSeekerProfile";
import Messages from "./pages/recruiter/Messages";
import JobSeekerMessages from "./pages/jobseeker/Messages";
import Settings from "./pages/recruiter/Settings";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import JobsManagement from "./pages/admin/JobsManagement";
import SkillsManagement from "./pages/admin/SkillsManagement";
import CitiesManagement from "./pages/admin/CitiesManagement";
import Logo from "./components/Logo";
import echo from "./echo";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});

  // Check for existing login & fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      if (echo && echo.connector && echo.connector.options) {
        echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
      }
      setIsLoggedIn(true);
      // Fetch user profile
      authApi
        .getMe()
        .then((profile) => {
          setUser(profile.data);
        })
        .catch(() => {
          // Token might be invalid
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
        });
    }
  }, []);

  // // Test connection
  // useEffect(() => {
  //   authApi
  //     .testConnection()
  //     .then((data) => {
  //       setBackendData(data);
  //     })
  //     .catch((err) => {
  //       setError(err.response?.data?.message || err.message);
  //     });
  // }, []);

  const handleLogout = () => {
    authApi.logout().finally(() => {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setUser(null);
      navigate("/");
    });
  };

  const handleAuthSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);

    // Inject Echo auth
    const token = localStorage.getItem("token");
    if (token && echo && echo.connector && echo.connector.options) {
      echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
    }

    // Role-based redirect
    if (userData.role === "recruiter") {
      navigate("/recruiter/dashboard");
    } else if (userData.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/jobs");
    }
  };

  const handleSearch = (filters) => {
    setSearchFilters(filters);
    navigate("/jobs");
  };

  // ================
  // ADMIN ROUTES
  // =================
  if (isLoggedIn && user?.role === "admin") {
    return (
      <AdminLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/jobs" element={<JobsManagement />} />
          <Route path="/admin/skills" element={<SkillsManagement />} />
          <Route path="/admin/cities" element={<CitiesManagement />} />
          <Route path="/admin/settings" element={<Settings />} />

          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
        </Routes>
      </AdminLayout>
    );
  }

  // ================
  // RECRUITER ROUTES
  // =================
  if (isLoggedIn && user?.role === "recruiter") {
    return (
      <RecruiterLayout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/profile" element={<Profile />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/edit-job/:id" element={<EditJob />} />
          <Route path="/recruiter/jobs" element={<MyJobs />} />
          <Route path="/recruiter/applications" element={<Candidates />} />
          <Route path="/recruiter/job-seekers/:id" element={<JobSeekerProfile />} />
          <Route
            path="/recruiter/messages"
            element={<Messages currentUser={user} />}
          />
          <Route path="/recruiter/settings" element={<Settings />} />

          {/* Fallback for recruiter */}
          <Route
            path="*"
            element={<Navigate to="/recruiter/dashboard" replace />}
          />
        </Routes>
      </RecruiterLayout>
    );
  }

  // ==========================
  // PUBLIC & JOB SEEKER ROUTES
  // ==========================
  return (
    <div className="min-h-screen bg-bg-gray">
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              onBack={() => navigate("/")}
              onRegisterClick={() => navigate("/register")}
              onLoginSuccess={handleAuthSuccess}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              onBack={() => navigate("/")}
              onLoginClick={() => navigate("/login")}
              onRegisterSuccess={handleAuthSuccess}
            />
          }
        />
        <Route
          path="/auth/google/callback"
          element={<GoogleCallback onAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="*"
          element={
            <>
              <Header
                onLoginClick={() => navigate("/login")}
                onFindJobsClick={() => navigate("/jobs")}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                user={user}
              />

              <main>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Hero onSearch={handleSearch} />
                        <BrowseCategories />
                        <FeaturedJobs
                          onJobClick={(id) => navigate(`/job/${id}`)}
                        />
                        <HowItWorks />
                        <TrustedCompanies />
                        <SuccessStories />
                      </>
                    }
                  />

                  <Route
                    path="/jobs"
                    element={
                      <Jobs
                        user={user}
                        initialFilters={searchFilters}
                        onJobClick={(id) => navigate(`/job/${id}`)}
                      />
                    }
                  />

                  <Route
                    path="/job/:jobId"
                    element={<JobDetails onBack={() => navigate("/jobs")} />}
                  />

                  <Route path="/saved-jobs" element={<SavedJobs />} />

                  <Route path="/profile" element={<Profile />} />

                  <Route
                    path="/messages"
                    element={<JobSeekerMessages currentUser={user} />}
                  />
                </Routes>
              </main>

              <LargeFooter />
            </>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
