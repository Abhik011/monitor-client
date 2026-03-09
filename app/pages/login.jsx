import { useState } from "react";
import { api } from "../utils/api";
import { useRouter } from "next/router";

export default function Login(){

  const router = useRouter();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async ()=>{

    const res = await api("/auth/login","POST",{
      email,
      password
    });

    if(res.token){

      localStorage.setItem("token",res.token);

      router.push("/dashboard");

    }else{

      alert("Login failed");

    }

  };

  return(

    <div style={{padding:40}}>

      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e=>setPassword(e.target.value)}
      />

      <button onClick={login}>
        Login
      </button>

    </div>

  );

}