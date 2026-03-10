import styles from "./css/styles.module.css";

export default function DevelopmentSection({ apiKey }: any) {

  return (

    <div className={styles.devCard}>

      <h2>Install Creonox Monitoring</h2>

      <p>
        Add the Creonox SDK to your website to start tracking
        errors, performance and API latency.
      </p>

      <h3>1. Install SDK</h3>

      <pre className={styles.code}>
        {`<script src="https://monitor.creonox.com/sdk.js"></script>

<script>
Creonox.init({
  apiKey: "${apiKey}"
})
</script>`}
      </pre>

      <h3>2. Optional: Identify Users</h3>

      <pre className={styles.code}>
        {`Creonox.setUser("user_123")`}
      </pre>

      <h3>3. Backend API Monitoring</h3>

      <pre className={styles.code}>
        {`fetch("https://monitor.creonox.com/data/track/${apiKey}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    type: "api",
    api: "/checkout",
    status: 500,
    latency: 3200
  })
})`}
      </pre>

      <h3>API Endpoint</h3>

      <div className={styles.endpoint}>
        POST https://monitor.creonox.com/data/track/{apiKey}
      </div>

    </div>

  );

}