import { useState } from "react";
import { login } from "../auth";
import { saveToken } from "../token";

export default function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleLogin() {
    try {
      const res = await login(email, password);
      saveToken(res.access_token);
      setMsg("Login successful");
    } catch {
      setMsg("Login failed");
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <h3>Login</h3>
      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      <p>{msg}</p>
    </div>
  );
}