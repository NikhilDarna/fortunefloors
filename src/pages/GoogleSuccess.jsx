import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleSuccess = () => {
  const [params] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      const user = { username: "Google User", role: "user" };
      login(token, user);
      navigate("/dashboard");
    }
  }, []);

  return <p>Logging in...</p>;
};

export default GoogleSuccess;
