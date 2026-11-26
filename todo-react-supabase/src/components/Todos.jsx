import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "./supabase.js";
import { validateTodo } from "./validation.js";
import "./todo.css";

// ===================================
// TODO PAGE (sirf login user ke todos)
// ===================================
export default function Todos({ user }) {
  const [allTodos, setAllTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const name = user.email.split("@")[0];

  // ===================================
  // GET ALL (RLS ki wajah se sirf apne todos aate hain)
  // ===================================
  const getAll = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
        return;
      }

      setAllTodos(data);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  // page khulte hi list ek dafa load
  useEffect(() => {
    getAll();
  }, []);

  // ===================================
  // ADD
  // ===================================
  const addTodo = async (e) => {
    e.preventDefault();

    const validateForm = validateTodo(title);
    if (validateForm === false) {
      return;
    }

    setSaving(true);

    try {
      const { data, error } = await supabase
        .from("todos")
        .insert({ title: title.trim(), done: false, user_id: user.id })
        .select()
        .single();

      if (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
        return;
      }

      setAllTodos([data, ...allTodos]);
      setTitle("");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  // ===================================
  // EDIT
  // ===================================
  const startEdit = (item) => {
    setEditId(item.id);
    setEditTitle(item.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const updateTodo = async (id) => {
    const validateForm = validateTodo(editTitle);
    if (validateForm === false) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ title: editTitle.trim() })
        .eq("id", Number(id))
        .select()
        .single();

      if (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
        return;
      }

      setAllTodos(allTodos.map((t) => (t.id === Number(id) ? data : t)));
      cancelEdit();
      Swal.fire({ icon: "success", title: "Updated", timer: 1000, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  // ===================================
  // DONE / UNDONE
  // ===================================
  const toggleDone = async (item) => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .update({ done: !item.done })
        .eq("id", Number(item.id))
        .select()
        .single();

      if (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
        return;
      }

      setAllTodos(allTodos.map((t) => (t.id === item.id ? data : t)));
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  // ===================================
  // DELETE
  // ===================================
  const deleteTodo = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this todo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    // user ne cancel kiya to ruk jao
    if (!result.isConfirmed) {
      return;
    }

    try {
      const { error } = await supabase.from("todos").delete().eq("id", Number(id));

      if (error) {
        Swal.fire({ icon: "error", title: "Oops...", text: error.message });
        return;
      }

      setAllTodos(allTodos.filter((t) => t.id !== Number(id)));
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops...", text: error.message });
    }
  };

  const remaining = allTodos.filter((t) => !t.done).length;

  return (
    <main className="todo-page">
      <div className="todo-card">
        <h1>{name}'s Todos</h1>
        <p className="muted">{remaining} task(s) left out of {allTodos.length}</p>

        {/* ===== add form ===== */}
        <form className="add-row" onSubmit={addTodo}>
          <input
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="add-btn" disabled={saving}>
            {saving ? "Adding..." : "+ Add"}
          </button>
        </form>

        {/* ===== list ===== */}
        {loading ? (
          <p className="empty">Loading...</p>
        ) : allTodos.length === 0 ? (
          <p className="empty">Nothing here yet. Add your first task 👆</p>
        ) : (
          <ul className="todo-list">
            {allTodos.map((item, index) => (
              <li key={item.id} className={item.done ? "done" : ""}>
                <span className="num">{index + 1}</span>

                {editId === item.id ? (
                  <>
                    <input
                      className="edit-input"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && updateTodo(item.id)}
                      autoFocus
                    />
                    <button className="icon-btn" onClick={() => updateTodo(item.id)}>💾</button>
                    <button className="icon-btn" onClick={cancelEdit}>✖️</button>
                  </>
                ) : (
                  <>
                    <input type="checkbox" checked={item.done} onChange={() => toggleDone(item)} />
                    <span className="text">{item.title}</span>
                    <button className="icon-btn" onClick={() => startEdit(item)}>✏️</button>
                    <button className="icon-btn" onClick={() => deleteTodo(item.id)}>🗑️</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
