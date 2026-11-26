import Swal from "sweetalert2";

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// ===================================
// LOGIN VALIDATION
// ===================================
export const validateLogin = (email, password) => {
  if (!emailRegex.test(email)) {
    Swal.fire({ icon: "error", title: "Oops...", text: "Please provide a valid email" });
    return false;
  }

  if (password.length < 6) {
    Swal.fire({ icon: "error", title: "Oops...", text: "Password must be at least 6 characters" });
    return false;
  }

  // koi error nahi aayi -> form valid hai
  return true;
};

// ===================================
// TODO VALIDATION
// ===================================
export const validateTodo = (title) => {
  if (title.trim().length < 3) {
    Swal.fire({ icon: "error", title: "Oops...", text: "Todo must be at least 3 characters" });
    return false;
  }

  return true;
};
