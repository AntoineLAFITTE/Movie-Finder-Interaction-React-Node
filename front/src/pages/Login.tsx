import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Login</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          try {
            await login(email, password);
            nav("/home");
          } catch (err: any) {
            setError(err.message || "Login failed");
          }
        }}
      >
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button type="submit">Se connecter</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: 12 }}>
        Pas de compte ? <Link to="/register">Créer un compte</Link>
      </p>
    </div>
  );
}
