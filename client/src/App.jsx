import { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  const register = async () => {
    await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    alert("Registered successfully");
  };

  const login = async () => {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    alert("Welcome " + data.email);
  };

  const addNote = async () => {
    await fetch("http://localhost:5000/add-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, note }),
    });
    alert("Note added");
  };

  const loadNotes = async () => {
    const res = await fetch(
      "http://localhost:5000/notes?email=" + email
    );
    const data = await res.json();
    setNotes(data);
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>SecureAuth Mini App</h1>

      <h3>Register</h3>
      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={register}>Register</button>

      <hr />

      <h3>Login</h3>
      <button onClick={login}>Login</button>

      <hr />

      <h3>Add Note</h3>
      <input
        placeholder="New Note"
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={addNote}>Add Note</button>

      <hr />

      <h3>Your Notes</h3>
      <button onClick={loadNotes}>Load Notes</button>
      <ul>
        {notes.map((n, i) => (
          <li key={i}>{n.note}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
