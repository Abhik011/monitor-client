import { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/router";

export default function CreateProject(){

  const router = useRouter();

  const [name,setName] = useState("");

  const create = async ()=>{

    const orgId = localStorage.getItem("orgId");

    const res = await api("/projects","POST",{
      name,
      organizationId: orgId
    });

    if(res.apiKey){

      alert("API KEY: "+res.apiKey);

      router.push("/dashboard");

    }

  };

  return(

    <div style={{padding:40}}>

      <h1>Create Project</h1>

      <input
        placeholder="Project name"
        onChange={e=>setName(e.target.value)}
      />

      <button onClick={create}>
        Create
      </button>

    </div>

  );

}