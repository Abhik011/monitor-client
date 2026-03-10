"use client";

import { useEffect, useState } from "react";

const plans = [
  { name: "Free", price: "₹0", events: "10K events", value: "FREE" },
  { name: "Startup", price: "₹499", events: "100K events", value: "STARTUP" },
  { name: "Growth", price: "₹1,999", events: "1M events", value: "GROWTH", popular:true },
  { name: "Business", price: "₹6,999", events: "10M events", value: "BUSINESS" }
];

export default function BillingPage(){

  const API = process.env.NEXT_PUBLIC_API_URL;

  const [loading,setLoading] = useState("");
  const [currentPlan,setCurrentPlan] = useState("");

  /* GET CURRENT PLAN */

  useEffect(()=>{

    const token = localStorage.getItem("token");

    fetch(`${API}/billing/usage`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    .then(res=>res.json())
    .then(data=>{
      if(data?.plan){
        setCurrentPlan(data.plan);
      }
    })

  },[API]);

  const upgrade = async(plan:string)=>{

    setLoading(plan);

    const token = localStorage.getItem("token");

    await fetch(`${API}/billing/upgrade`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({plan})
    });

    setCurrentPlan(plan);

    alert("Plan updated successfully");

    setLoading("");

  }

  return(

    <div style={styles.wrapper}>

      <h1 style={styles.title}>Billing & Plans</h1>

      <p style={styles.subtitle}>
        Choose the plan that fits your monitoring usage
      </p>

      <div style={styles.grid}>

        {plans.map(p=>{

          const isCurrent = currentPlan === p.value;

          return(

            <div
            key={p.value}
            style={{
              ...styles.card,
              border:p.popular
                ? "2px solid #7c3aed"
                : "1px solid #e5e7eb"
            }}>

              {p.popular && (
                <div style={styles.popular}>
                  Most Popular
                </div>
              )}

              <h2>{p.name}</h2>

              <div style={styles.price}>
                {p.price}
              </div>

              <div style={styles.events}>
                {p.events}
              </div>

              <button
              style={{
                ...styles.button,
                background:isCurrent ? "#9ca3af" : "#7c3aed"
              }}
              disabled={loading === p.value || isCurrent}
              onClick={()=>upgrade(p.value)}
              >

                {isCurrent
                  ? "Current Plan"
                  : loading === p.value
                  ? "Updating..."
                  : "Upgrade"}

              </button>

            </div>

          )

        })}

      </div>

    </div>

  )

}

const styles:any = {

  wrapper:{
    padding:60
  },

  title:{
    fontSize:32,
    fontWeight:700
  },

  subtitle:{
    marginTop:6,
    color:"#6b7280"
  },

  grid:{
    marginTop:40,
    display:"grid",
    gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
    gap:25
  },

  card:{
    background:"#fff",
    padding:30,
    borderRadius:12,
    position:"relative"
  },

  popular:{
    position:"absolute",
    top:-10,
    left:20,
    background:"#7c3aed",
    color:"#fff",
    fontSize:12,
    padding:"4px 10px",
    borderRadius:6
  },

  price:{
    fontSize:30,
    fontWeight:700,
    marginTop:10
  },

  events:{
    marginTop:6,
    color:"#6b7280"
  },

  button:{
    marginTop:20,
    padding:12,
    border:"none",
    borderRadius:8,
    color:"#fff",
    fontWeight:600,
    cursor:"pointer",
    width:"100%"
  }

};