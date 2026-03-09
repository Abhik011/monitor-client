"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../css/sidebar.module.css";

export default function Sidebar() {

  const router = useRouter();
  const pathname = usePathname();

  const API =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [projects,setProjects] = useState<any[]>([]);
  const [selectedProject,setSelectedProject] = useState<string | null>(null);

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    // { name: "Errors", path: "/errors" },
    // { name: "API Monitoring", path: "/api" },
    // { name: "Sessions", path: "/sessions" },
    { name: "Development", path: "/development" },
    { name: "Projects", path: "/projects" }
  ];

  /* --------------------------
     LOAD PROJECTS
  -------------------------- */

  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch(`${API}/projects`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {

        const list = data.projects || [];

        setProjects(list);

        const storedProject = localStorage.getItem("projectId");

        if(storedProject){
          setSelectedProject(storedProject);
        } else if(list.length > 0){
          setSelectedProject(list[0]._id);
          localStorage.setItem("projectId",list[0]._id);
        }

      });

  },[]);

  /* --------------------------
     PROJECT CHANGE
  -------------------------- */

  const changeProject = (id:string) => {

    setSelectedProject(id);

    localStorage.setItem("projectId",id);

    // reload dashboard data
    router.refresh();

  };

  return (

    <div className={styles.sidebar}>

      <div className={styles.logo}>
        Creonox
      </div>

      {/* PROJECT SELECTOR */}

      <div className={styles.project}>

        <span>Project</span>

        <select
          className={styles.projectSelect}
          value={selectedProject || ""}
          onChange={(e)=>changeProject(e.target.value)}
        >

          {projects.map((p)=>(
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}

        </select>

      </div>

      {/* MENU */}

      <nav className={styles.menu}>

        {menu.map((item) => (

          <div
            key={item.path}
            className={`${styles.menuItem} ${
              pathname === item.path ? styles.active : ""
            }`}
            onClick={() => router.push(item.path)}
          >
            {item.name}
          </div>

        ))}

      </nav>

      {/* FOOTER */}

      <div className={styles.footer}>

        <div
          className={styles.menuItem}
          onClick={() => router.push("/settings")}
        >
          Settings
        </div>

        <div
          className={styles.menuItem}
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("projectId");
            router.push("/login");
          }}
        >
          Logout
        </div>

      </div>

    </div>

  );

}