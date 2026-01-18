import { apiRequest } from "./api";

export async function signup(email, password) {
  return apiRequest(
    `/auth/signup?email=${email}&password=${password}`,
    "POST"
  );
}

export async function login(email, password) {
  const res = await fetch("http://127.0.0.1:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: email,
      password,
    }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}