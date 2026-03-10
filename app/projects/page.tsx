"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {

  const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

  const [projects, setProjects] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState<any>({});

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  /* --------------------------
     LOAD PROJECTS
  -------------------------- */

  const loadProjects = async () => {

  try {

    const organizationId = localStorage.getItem("organizationId");

    const res = await fetch(
      `${API}/projects?organizationId=${organizationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      console.error("Failed to load projects");
      return;
    }

    const data = await res.json();

    setProjects(data.projects || []);

  } catch (err) {

    console.error("Project fetch error", err);

  }

};

  useEffect(() => {
    loadProjects();
  }, []);

  /* --------------------------
     CREATE PROJECT
  -------------------------- */

  const createProject = async () => {

    if (!name) return;

    setLoading(true);

    const organizationId =
      localStorage.getItem("organizationId");

    const res = await fetch(`${API}/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        name,
        organizationId
      })
    });

    await res.json();

    setName("");
    setLoading(false);

    loadProjects();

  };

  /* --------------------------
     TOGGLE API KEY
  -------------------------- */

  const toggleKey = (id: string) => {

    setShowKey((prev: any) => ({
      ...prev,
      [id]: !prev[id]
    }));

  };

  return (

    <div style={styles.wrapper}>

      <h1 style={styles.title}>
        Projects
      </h1>

      {/* CREATE PROJECT */}

      <div style={styles.createCard}>

        <input
          style={styles.input}
          placeholder="New project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          style={styles.button}
          onClick={createProject}
        >
          {loading ? "Creating..." : "Create Project"}
        </button>

      </div>

      {/* PROJECT LIST */}

      <div style={styles.grid}>

        {projects.map((p) => {

          const visible = showKey[p._id];

          return (

            <div key={p._id} style={styles.card}>

              <h3>{p.name}</h3>

              <div style={styles.apiSection}>

                <span style={styles.label}>
                  API Key
                </span>

                <div style={styles.apiRow}>

                  <code style={styles.apiKey}>

                    {visible
                      ? p.apiKey
                      : "••••••••••••••••••••"}

                  </code>

                  <button
                    style={styles.smallBtn}
                    onClick={() => toggleKey(p._id)}
                  >
                    {visible ? "Hide" : "Reveal"}
                  </button>

                </div>

              </div>

              <div style={styles.endpoint}>

                POST /track/{p.apiKey.slice(0, 10)}...

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}

/* --------------------------
   STYLES
-------------------------- */

const styles: any = {

  wrapper: {
    padding: 40,
    background: "#f8fafc",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif"
  },

  title: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 30
  },

  createCard: {
    display: "flex",
    gap: 10,
    marginBottom: 30
  },

  input: {
    padding: 10,
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    flex: 1
  },

  button: {
    background: "#6366f1",
    border: "none",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 20
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #e5e7eb"
  },

  apiSection: {
    marginTop: 15
  },

  label: {
    fontSize: 12,
    color: "#6b7280"
  },

  apiRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 6
  },

  apiKey: {
    background: "#f1f5f9",
    padding: "6px 10px",
    borderRadius: 6
  },

  smallBtn: {
    border: "1px solid #e5e7eb",
    background: "#fff",
    padding: "5px 10px",
    borderRadius: 6,
    cursor: "pointer"
  },

  endpoint: {
    marginTop: 15,
    fontSize: 12,
    color: "#6b7280"
  }

};