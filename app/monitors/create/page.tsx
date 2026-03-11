"use client";

import { useState } from "react";

export default function CreateMonitor() {

  const [name,setName] = useState("");
  const [url,setUrl] = useState("");

  const createMonitor = async () => {

    await fetch("http://localhost:4000/api/monitors",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        organizationId:"ORG_ID",
        projectId:"PROJECT_ID",
        name,
        url
      })
    });

    alert("Monitor Created");

  };

  return(

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Create Monitor
      </h1>

      <input
        placeholder="Monitor Name"
        className="border p-2 w-full mb-4"
        value={name}
        onChange={(e)=>setName(e.target.value)}
      />

      <input
        placeholder="https://example.com"
        className="border p-2 w-full mb-4"
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
      />

      <button
        onClick={createMonitor}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Create
      </button>

    </div>

  );

}