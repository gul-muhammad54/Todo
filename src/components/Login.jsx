import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "./supabase.js";
import { validateLogin } from "./validation.js";
import "./auth.css";

// ===================================
// LOGIN PAGE
// ===================================
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    // validation false hui to yahin ruk jao
    const validateForm = validateLogin(email, password);
    if (validateForm === false) {
      return;
    }

    // button disable + text change jab tak kaam ho raha hai
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
        return;
      }

      Swal.fire({ icon: "success", title: "Login successful", timer: 1000, showConfirmButton: false });
      // App.jsx ka onAuthStateChange khud todo page khol dega
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    } finally {
      // success ho ya fail, button wapis normal
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✅</div>
        <h1>Todo App</h1>
        <p className="subtitle">Sign in to continue</p>

        <form onSubmit={login}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="auth-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
