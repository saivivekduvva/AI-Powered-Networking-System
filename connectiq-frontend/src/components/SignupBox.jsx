import { useState } from "react";
import { signup } from "../auth";

export default function SignupBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  async function handleSignup() {
    try {
      await signup(email, password);
      setMsg("Signup successful — now login");
    } catch {
      setMsg("Signup failed");
    }
  }

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <h3>Signup</h3>
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
      <button onClick={handleSignup}>Signup</button>
      <p>{msg}</p>
    </div>
  );
}