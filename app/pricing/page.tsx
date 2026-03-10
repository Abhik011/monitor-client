"use client";

import { useRouter } from "next/navigation";

const plans = [
  {
    name: "Free",
    price: "₹0",
    events: "10K events",
    features: [
      "10,000 events / month",
      "Basic error tracking",
      "1 project",
      "Community support"
    ],
    plan: "FREE"
  },
  {
    name: "Startup",
    price: "₹499",
    events: "100K events",
    features: [
      "100,000 events / month",
      "API monitoring",
      "5 projects",
      "Email alerts"
    ],
    plan: "STARTUP"
  },
  {
    name: "Growth",
    price: "₹1,999",
    events: "1M events",
    features: [
      "1,000,000 events / month",
      "Session tracking",
      "Unlimited projects",
      "Slack alerts",
      "Advanced analytics"
    ],
    plan: "GROWTH",
    popular: true
  },
  {
    name: "Business",
    price: "₹6,999",
    events: "10M events",
    features: [
      "10,000,000 events / month",
      "Team access",
      "Priority support",
      "Custom alerts",
      "Advanced dashboards"
    ],
    plan: "BUSINESS"
  }
];

export default function PricingPage() {

  const router = useRouter();

  const upgrade = (plan: string) => {

    router.push(`/upgrade?plan=${plan}`);

  };

  return (

    <div style={styles.wrapper}>

      <h1 style={styles.title}>
        Pricing
      </h1>

      <p style={styles.subtitle}>
        Choose the plan that fits your monitoring needs
      </p>

      <div style={styles.grid}>

        {plans.map((p) => (

          <div
            key={p.name}
            style={{
              ...styles.card,
              border: p.popular
                ? "2px solid #7c3aed"
                : "1px solid #e5e7eb"
            }}
          >

            {p.popular && (
              <div style={styles.popular}>
                Most Popular
              </div>
            )}

            <h2>{p.name}</h2>

            <div style={styles.price}>
              {p.price}
              <span style={styles.per}> / month</span>
            </div>

            <div style={styles.events}>
              {p.events}
            </div>

            <ul style={styles.features}>
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <button
              style={styles.button}
              onClick={() => upgrade(p.plan)}
            >
              Choose Plan
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

const styles:any = {

  wrapper:{
    padding:60,
    textAlign:"center"
  },

  title:{
    fontSize:40,
    fontWeight:700
  },

  subtitle:{
    marginTop:10,
    marginBottom:50,
    color:"#6b7280"
  },

  grid:{
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
    gap:30,
    maxWidth:1100,
    margin:"auto"
  },

  card:{
    background:"#fff",
    borderRadius:12,
    padding:30,
    textAlign:"left",
    position:"relative"
  },

  popular:{
    position:"absolute",
    top:-12,
    left:20,
    background:"#7c3aed",
    color:"#fff",
    fontSize:12,
    padding:"4px 10px",
    borderRadius:6
  },

  price:{
    fontSize:34,
    fontWeight:700,
    marginTop:10
  },

  per:{
    fontSize:14,
    color:"#6b7280"
  },

  events:{
    marginTop:6,
    color:"#7c3aed",
    fontWeight:600
  },

  features:{
    marginTop:20,
    marginBottom:25,
    paddingLeft:18,
    lineHeight:"28px"
  },

  button:{
    width:"100%",
    padding:12,
    borderRadius:8,
    border:"none",
    background:"#7c3aed",
    color:"#fff",
    fontWeight:600,
    cursor:"pointer"
  }

};