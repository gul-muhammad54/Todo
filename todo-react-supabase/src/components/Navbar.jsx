import Swal from "sweetalert2";
import { supabase } from "./supabase.js";
import "./todo.css";

// ===================================
// NAVBAR + LOGOUT
// ===================================
export default function Navbar({ user }) {
  // email ke @ se pehle wala hissa naam bana lo
  const name = user.email.split("@")[0];

  const logout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Do you want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
    });

    // user ne cancel kiya to ruk jao
    if (!result.isConfirmed) {
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  return (
    <header className="navbar">
      <h2>✅ Todo App</h2>

      <div className="nav-user">
        <div className="avatar">{name[0].toUpperCase()}</div>
        <span>{name}</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
