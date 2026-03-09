import { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/router";

export default function Signup(){

  const router = useRouter();

  const [form,setForm] = useState({
    email:"",
    password:"",
    name:"",
    organizationName:""
  });

  const submit = async ()=>{

    const res = await api("/auth/signup","POST",form);

    if(res.token){

      localStorage.setItem("token",res.token);
      localStorage.setItem("orgId",res.organizationId);

      router.push("/dashboard");

    }else{

      alert(res.error);

    }

  };

  return(

    <div style={{padding:40}}>

      <h1>Create Account</h1>

      <input placeholder="Name"
        onChange={e=>setForm({...form,name:e.target.value})}
      />

      <input placeholder="Email"
        onChange={e=>setForm({...form,email:e.target.value})}
      />

      <input type="password" placeholder="Password"
        onChange={e=>setForm({...form,password:e.target.value})}
      />

      <input placeholder="Organization"
        onChange={e=>setForm({...form,organizationName:e.target.value})}
      />

      <button onClick={submit}>
        Signup
      </button>

    </div>

  );

}