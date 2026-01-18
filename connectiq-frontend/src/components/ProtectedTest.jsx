import { useState } from "react";
import { apiRequest } from "../api";
import { getToken } from "../token";

export default function ProtectedTest() {
  const [msg, setMsg] = useState("");

  async function testApi() {
    try {
      const token = getToken();
      const res = await apiRequest("/protected-test", "GET", null, token);
      setMsg(JSON.stringify(res, null, 2));
    } catch {
      setMsg("Unauthorized or token missing");
    }
  }

  return (
    <div style={{ border: "1px solid green", padding: 10 }}>
      <h3>Protected API Test</h3>
      <button onClick={testApi}>Call Protected API</button>
      <pre>{msg}</pre>
    </div>
  );
}