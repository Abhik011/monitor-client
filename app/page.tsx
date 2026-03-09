"use client";

import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  return (

    <div style={styles.wrapper}>

      {/* NAVBAR */}

      <div style={styles.navbar}>

        <div style={styles.logo}>Creonox</div>

        <div style={styles.navLinks}>
          <button style={styles.link} onClick={() => router.push("/login")}>
            Login
          </button>

          <button style={styles.primary} onClick={() => router.push("/signup")}>
            Get Started
          </button>
        </div>

      </div>

      {/* HERO */}

      <div style={styles.hero}>

        <h1 style={styles.title}>
          Monitor Errors, APIs & Performance
        </h1>

        <p style={styles.subtitle}>
          Creonox helps developers track errors, API latency,
          and performance issues in real time.
        </p>

        <div style={styles.heroButtons}>

          <button
            style={styles.primaryLarge}
            onClick={() => router.push("/signup")}
          >
            Start Monitoring
          </button>

          <button
            style={styles.secondary}
            onClick={() => router.push("/dashboard")}
          >
            View Dashboard
          </button>

        </div>

      </div>

      {/* FEATURES */}

      <div style={styles.features}>

        <Feature
          title="Real-time Error Tracking"
          text="Detect JavaScript and API errors instantly with realtime alerts."
        />

        <Feature
          title="Performance Monitoring"
          text="Track slow pages, API latency, and memory usage."
        />

        <Feature
          title="Developer Friendly"
          text="Install the Creonox SDK in under 1 minute."
        />

      </div>

      {/* SDK SECTION */}

      <div style={styles.sdk}>

        <h2>Install in 10 seconds</h2>

        <pre style={styles.code}>
{`<script src="https://monitor.creonox.com/sdk.js"></script>

<script>
Creonox.init({
  apiKey: "MC_LIVE_xxxxxxxxx"
})
</script>`}
        </pre>

      </div>

      {/* FOOTER */}

      <div style={styles.footer}>
        © {new Date().getFullYear()} Creonox Monitoring
      </div>

    </div>

  );

}

/* -----------------------------
   FEATURE COMPONENT
----------------------------- */

function Feature({ title, text }: any) {

  return (
    <div style={styles.featureCard}>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );

}

/* -----------------------------
   STYLES
----------------------------- */

const styles: any = {

  wrapper: {
    background: "#020617",
    color: "#fff",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  navbar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 40px",
    borderBottom: "1px solid #111",
  },

  logo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7c3aed",
  },

  navLinks: {
    display: "flex",
    gap: 10,
  },

  link: {
    background: "transparent",
    border: "none",
    color: "#aaa",
    cursor: "pointer",
  },

  primary: {
    background: "#7c3aed",
    border: "none",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },

  hero: {
    textAlign: "center",
    padding: "120px 20px",
  },

  title: {
    fontSize: 48,
    marginBottom: 20,
  },

  subtitle: {
    fontSize: 18,
    opacity: 0.8,
    maxWidth: 600,
    margin: "auto",
  },

  heroButtons: {
    marginTop: 30,
    display: "flex",
    gap: 20,
    justifyContent: "center",
  },

  primaryLarge: {
    background: "#7c3aed",
    padding: "14px 28px",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },

  secondary: {
    background: "#111",
    padding: "14px 28px",
    border: "1px solid #333",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
    padding: "60px 40px",
  },

  featureCard: {
    background: "#020617",
    border: "1px solid #111",
    padding: 30,
    borderRadius: 10,
  },

  sdk: {
    textAlign: "center",
    padding: "80px 20px",
  },

  code: {
    background: "#020617",
    border: "1px solid #111",
    padding: 20,
    marginTop: 20,
    display: "inline-block",
    textAlign: "left",
  },

  footer: {
    textAlign: "center",
    padding: 40,
    opacity: 0.6,
  },

};