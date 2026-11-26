import { useEffect, useState } from "react";
import Login from "./components/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import Todos from "./components/Todos.jsx";
import { supabase } from "./components/supabase.js";

// ===================================
// APP - sirf components ko call karta hai
// ===================================
export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // refresh par pehle se login session hai ya nahi
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session ? data.session.user : null);
      setChecking(false);
    });

    // login / logout hote hi user khud update ho jaye
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session ? session.user : null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (checking) {
    return <p style={{ textAlign: "center", marginTop: 80 }}>Loading...</p>;
  }

  // user nahi hai to login page dikhao
  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Navbar user={user} />
      {/* key lagayi taake user badalte hi todos naye sirey se load hon */}
      <Todos key={user.id} user={user} />
    </>
  );
}
