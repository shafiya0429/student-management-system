import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const success = onLogin(username, password);

    if (!success) {
      setError("Invalid username or password!");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Student Management</h1>
        <h3>Admin Login</h3>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="login-error">{error}</p>}

          <button type="submit">Login</button>
        </form>

        <p className="login-hint">
          Default username: admin<br />
          Default password: admin123
        </p>
      </div>
    </div>
  );
}

export default Login;
