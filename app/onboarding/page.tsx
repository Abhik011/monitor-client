"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {

  const router = useRouter();

  const [projectName,setProjectName] = useState("");
  const [apiKey,setApiKey] = useState("");
  const [loading,setLoading] = useState(false);

  const API =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000";

  const createProject = async () => {

    setLoading(true);

    const orgId = localStorage.getItem("organizationId");
    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/projects`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify({
        name:projectName,
        organizationId:orgId
      })
    });

    const data = await res.json();

    if(data.apiKey){

      setApiKey(data.apiKey);

      localStorage.setItem("projectId",data.projectId);

    }

    setLoading(false);

  };

  return (

    <div style={styles.wrapper}>

      <div style={styles.card}>

        <h1>Create your first project</h1>

        {!apiKey && (

          <>
            <p>
              Projects help you organize monitoring for
              different applications.
            </p>

            <input
              style={styles.input}
              placeholder="Project name (ex: my-app)"
              value={projectName}
              onChange={(e)=>setProjectName(e.target.value)}
            />

            <button
              style={styles.button}
              onClick={createProject}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </>

        )}

        {apiKey && (

          <div style={{marginTop:30}}>

            <h2>Your API Key</h2>

            <div style={styles.apiKey}>
              {apiKey}
            </div>

            <h3>Install the Creonox SDK</h3>

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
              onClick={()=>router.push("/dashboard")}
            >
              Go to Dashboard
            </button>

          </div>

        )}

      </div>

    </div>

  );

}

const styles:any = {

  wrapper:{
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    height:"100vh",
    background:"#020617",
    color:"#fff",
    fontFamily:"Inter, sans-serif"
  },

  card:{
    width:500,
    padding:40,
    background:"#0f172a",
    borderRadius:12,
    border:"1px solid #1e293b"
  },

  input:{
    width:"100%",
    padding:12,
    marginTop:20,
    borderRadius:6,
    border:"1px solid #334155",
    background:"#020617",
    color:"#fff"
  },

  button:{
    marginTop:20,
    padding:12,
    border:"none",
    borderRadius:8,
    background:"#7c3aed",
    color:"#fff",
    cursor:"pointer"
  },

  apiKey:{
    background:"#020617",
    border:"1px solid #334155",
    padding:12,
    marginTop:10,
    borderRadius:6
  },

  code:{
    marginTop:20,
    padding:20,
    background:"#020617",
    border:"1px solid #334155",
    borderRadius:6
  }

};