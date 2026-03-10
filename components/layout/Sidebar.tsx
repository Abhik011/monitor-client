"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../css/sidebar.module.css";
import Link from "next/link";

import {
  LayoutDashboard,
  Code,
  FolderKanban,
  Settings,
  LogOut
} from "lucide-react";

export default function Sidebar() {

  const router = useRouter();
  const pathname = usePathname();

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [organizationName, setOrganizationName] = useState("Organization");

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Developer", path: "/development", icon: Code },
    { name: "Projects", path: "/projects", icon: FolderKanban }
  ];

  /* --------------------------
     INIT LOAD
  -------------------------- */

useEffect(() => {

  const token = localStorage.getItem("token");
  const organizationId = localStorage.getItem("organizationId");

  /* LOAD ORG NAME */

  const storedOrg = localStorage.getItem("organizationName");

  if (storedOrg) {
    setOrganizationName(storedOrg);
  } else {

    fetch(`${API}/organizations/${organizationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {

        if (data?.name) {

          setOrganizationName(data.name);

          localStorage.setItem("organizationName", data.name);

        }

      });

  }

  /* LOAD PROJECTS */

  fetch(`${API}/projects?organizationId=${organizationId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {

      const list = data.projects || [];

      setProjects(list);

      const storedProject = localStorage.getItem("projectId");

      if (storedProject) {
        setSelectedProject(storedProject);
      }
      else if (list.length > 0) {

        setSelectedProject(list[0]._id);

        localStorage.setItem("projectId", list[0]._id);

      }

    });

}, []);

  /* --------------------------
     PROJECT CHANGE
  -------------------------- */

  const changeProject = (id: string) => {

    setSelectedProject(id);

    localStorage.setItem("projectId", id);

    window.dispatchEvent(new Event("projectChanged"));

  };

  return (

    <div className={styles.sidebar}>

      {/* ORG NAME */}

      <div className={styles.logoRow}>
        <div className={styles.logo}>
          <h2>Monitor</h2>
           <div className={styles.logoi}>
          <h4>By Creonox Technologies</h4>
          </div>
        </div>
      
      </div>

      {/* PROJECT SELECTOR */}

      <div className={styles.project}>

        <span>Project</span>

        <select
          className={styles.projectSelect}
          value={selectedProject || ""}
          onChange={(e) => changeProject(e.target.value)}
        >

          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}

        </select>

      </div>

      {/* MENU */}

      <nav className={styles.menu}>

        {menu.map((item) => {

          const Icon = item.icon;
          const active = pathname === item.path;

          return (

            <Link
              key={item.path}
              href={item.path}
              className={`${styles.menuItem} ${active ? styles.active : ""}`}
            >

              <div className={styles.iconBox}>
                <Icon size={18} />
              </div>

              <span>{item.name}</span>

            </Link>

          );

        })}

      </nav>

      {/* FOOTER */}

      <div className={styles.footer}>

        <div
          className={styles.menuItem}
          onClick={() => router.push("/settings")}
        >

          <div className={styles.iconBox}>
            <Settings size={18} />
          </div>

          <span>Settings</span>

        </div>

        <div
          className={styles.menuItem}
          onClick={() => {

            localStorage.removeItem("token");
            localStorage.removeItem("projectId");

            router.push("/login");

          }}
        >

          <div className={styles.iconBox}>
            <LogOut size={18} />
          </div>

          <span>Logout</span>

        </div>

      </div>

    </div>

  );

}