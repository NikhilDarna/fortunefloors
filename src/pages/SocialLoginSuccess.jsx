import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SocialLoginSuccess() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const email = params.get("email");
    const name = params.get("name");

    if (token && email) {
      const user = { email, fullName: name };

      // Save in AuthContext
      login(token, user);

      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Logging in...</p>;
}
