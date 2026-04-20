import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import authApi from "../api/auth.api";
import { Loader2, AlertCircle } from "lucide-react";

export default function GoogleCallback({ onAuthSuccess }) {
  const [error, setError] = useState("");
  const hasRun = useRef(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (hasRun.current) return;
    
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const role = localStorage.getItem("pending_google_role") || "job_seeker";

      if (!code) {
        setError("No authorization code found.");
        return;
      }

      hasRun.current = true;

      try {
        const response = await authApi.googleCallback({ code, role });
        
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.removeItem("pending_google_role");
          
          if (onAuthSuccess) {
            onAuthSuccess(response.data.user);
          } else {
            navigate("/");
          }
        } else {
          setError("Failed to authenticate with Google.");
        }
      } catch (err) {
        console.error("Google callback error:", err);
        setError(err.response?.data?.message || "An error occurred during Google authentication.");
      }
    };

    handleCallback();
  }, [location, navigate, onAuthSuccess]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {!error ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-jolly-purple animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-jolly-navy">Authenticating...</h2>
            <p className="text-gray-500 text-sm">
              Please wait while we securely sign you in with Google.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-danger" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-jolly-navy">Authentication Failed</h2>
            <p className="text-danger text-sm font-medium">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-jolly-purple hover:bg-jolly-deep-purple text-white font-medium py-3 rounded-xl transition-all"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
