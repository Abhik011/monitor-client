"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

  const login = async (e: any) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("organizationId", data.organizationId);

      if (data.projects && data.projects.length > 0) {
        localStorage.setItem("projectId", data.projects[0]._id);
      }

      router.push("/dashboard");

    } catch (err: any) {

      setError(err.message);

    }

    setLoading(false);

  };

  return (

    <div style={styles.wrapper}>

      <div style={styles.card}>

        <h1 style={styles.title}>Login to Creonox</h1>

        <p style={styles.subtitle}>
          Access your monitoring dashboard
        </p>

        <form onSubmit={login} style={styles.form}>

          <input
            style={styles.input}
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <div style={styles.footer}>

          Don't have an account?

          <span
            style={styles.link}
            onClick={() => router.push("/signup")}
          >
            Create one
          </span>

        </div>

      </div>

    </div>

  );

}

const styles: any = {

  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#020617",
    color: "#fff",
    fontFamily: "Inter, sans-serif"
  },

  card: {
    width: 420,
    padding: 40,
    borderRadius: 12,
    background: "#0f172a",
    border: "1px solid #1e293b"
  },

  title: {
    fontSize: 28,
    marginBottom: 10
  },

  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 30
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 15
  },

  input: {
    padding: 12,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "#020617",
    color: "#fff"
  },

  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#7c3aed",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600
  },

  error: {
    background: "#7f1d1d",
    padding: 10,
    borderRadius: 6,
    fontSize: 13
  },

  footer: {
    marginTop: 20,
    fontSize: 14,
    opacity: 0.8
  },

  link: {
    marginLeft: 6,
    color: "#7c3aed",
    cursor: "pointer"
  }

};