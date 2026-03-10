"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const plans = [
  { name: "Free", price: "₹0", events: "10K events", value: "FREE" },
  { name: "Startup", price: "₹499", events: "100K events", value: "STARTUP" },
  { name: "Growth", price: "₹1,999", events: "1M events", value: "GROWTH" },
  { name: "Business", price: "₹6,999", events: "10M events", value: "BUSINESS" }
];

export default function OnboardingPage() {

  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [plan, setPlan] = useState("FREE");

  const [loading, setLoading] = useState(false);

  const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

  const createProject = async () => {

    setLoading(true);

    const orgId = localStorage.getItem("organizationId");
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name: projectName,
        organizationId: orgId,
        plan
      })
    });

    const data = await res.json();

    if (data.apiKey) {

      setApiKey(data.apiKey);

      localStorage.setItem("projectId", data.projectId);

    }

    setLoading(false);

  };

  return (

    <div style={styles.wrapper}>

      <div style={styles.card}>

        <h1 style={styles.title}>
          Create your first project
        </h1>

        {!apiKey && (

          <>
            <p style={styles.subtitle}>
              Start monitoring your application with Creonox
            </p>

            {/* PROJECT NAME */}

            <input
              style={styles.input}
              placeholder="Project name (ex: my-app)"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            {/* PLAN SELECT */}

            <h3 style={{ marginTop: 25 }}>
              Choose a plan
            </h3>

            <div style={styles.planGrid}>

              {plans.map((p) => (

                <div
                  key={p.value}
                  onClick={() => setPlan(p.value)}
                  style={{
                    ...styles.planCard,
                    border:
                      plan === p.value
                        ? "2px solid #7c3aed"
                        : "1px solid #e5e7eb"
                  }}
                >

                  <div style={styles.planName}>
                    {p.name}
                  </div>

                  <div style={styles.planPrice}>
                    {p.price}
                  </div>

                  <div style={styles.planEvents}>
                    {p.events}
                  </div>

                </div>

              ))}

            </div>

            <button
              style={styles.button}
              onClick={createProject}
              disabled={loading}
            >

              {loading
                ? "Creating..."
                : "Create Project"}

            </button>
          </>

        )}

        {/* API KEY */}

        {apiKey && (

          <div style={{ marginTop: 30 }}>

            <h2>Your API Key</h2>

            <div style={styles.apiKey}>
              {apiKey}
            </div>

            <h3 style={{ marginTop: 25 }}>
              Install SDK
            </h3>

            <pre style={styles.code}>
{`<script src="https://monitor.creonox.com/sdk.js"></script>

<script>
Creonox.init({
  apiKey: "${apiKey}"
})
</script>`}
            </pre>

            <button
              style={styles.button}
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </button>

          </div>

        )}

      </div>

    </div>

  );

}

const styles: any = {

  wrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "Inter, sans-serif"
  },

  card: {
    width: 640,
    padding: 40,
    background: "#ffffff",
    borderRadius: 12,
    border: "1px solid #e5e7eb"
  },

  title: {
    fontSize: 26,
    fontWeight: 700
  },

  subtitle: {
    marginTop: 6,
    color: "#6b7280"
  },

  input: {
    width: "100%",
    padding: 12,
    marginTop: 20,
    borderRadius: 8,
    border: "1px solid #e5e7eb"
  },

  planGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,1fr)",
    gap: 15,
    marginTop: 10
  },

  planCard: {
    padding: 16,
    borderRadius: 10,
    cursor: "pointer"
  },

  planName: {
    fontWeight: 600
  },

  planPrice: {
    fontSize: 20,
    fontWeight: 700,
    marginTop: 6
  },

  planEvents: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4
  },

  button: {
    marginTop: 25,
    padding: 12,
    border: "none",
    borderRadius: 8,
    background: "#7c3aed",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%"
  },

  apiKey: {
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    padding: 12,
    marginTop: 10,
    borderRadius: 6
  },

  code: {
    marginTop: 20,
    padding: 20,
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 6
  }

};