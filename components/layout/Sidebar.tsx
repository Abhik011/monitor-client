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
  LogOut,
  Activity,
  Bug,
  Zap,
  Timer,
  Globe,
  AlertTriangle,
  ChartNoAxesColumnIncreasing,
  CreditCard,
  Database
} from "lucide-react";

export default function Sidebar() {

  const router = useRouter();
  const pathname = usePathname();

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const [organizationName, setOrganizationName] = useState("Organization");

  /* --------------------------
     MENU STRUCTURE
  -------------------------- */

  const menu = [

    {
      section: "Overview",
      items: [
        { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }
      ]
    },

    {
      section: "Monitoring",
      items: [
        { name: "Events", path: "/events", icon: Activity },
        { name: "Errors", path: "/errors", icon: Bug },
        { name: "Performance", path: "/performance", icon: Zap },
        { name: "Sessions", path: "/sessions", icon: Timer }
      ]
    },

    {
      section: "Reliability",
      items: [
        { name: "Monitors", path: "/monitors", icon: ChartNoAxesColumnIncreasing },
        { name: "Incidents", path: "/incidents", icon: AlertTriangle },
        { name: "Alerts", path: "/alerts", icon: Globe }
      ]
    },

    {
      section: "Analytics",
      items: [
        { name: "API Monitoring", path: "/api", icon: Activity },
        { name: "Resources", path: "/resources", icon: Database }
      ]
    },

    {
      section: "Development",
      items: [
        { name: "Developer", path: "/development", icon: Code },
        { name: "Projects", path: "/projects", icon: FolderKanban }
      ]
    },

    {
      section: "Account",
      items: [
        { name: "Usage", path: "/usage", icon: ChartNoAxesColumnIncreasing },
        { name: "Billing", path: "/billing", icon: CreditCard }
      ]
    }

  ];

  /* --------------------------
     INIT LOAD
  -------------------------- */

  useEffect(() => {

    const token = localStorage.getItem("token");
    const organizationId = localStorage.getItem("organizationId");

    const storedOrg = localStorage.getItem("organizationName");

    if (storedOrg) {
      setOrganizationName(storedOrg);
    }
    else {

      fetch(`${API}/organizations/${organizationId}`, {
        headers: { Authorization: `Bearer ${token}` }
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
      headers: { Authorization: `Bearer ${token}` }
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

  /* --------------------------
     RENDER
  -------------------------- */

  return (

    <div className={styles.sidebar}>

      {/* LOGO */}

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

        {menu.map((group) => (

          <div key={group.section}>

            <div className={styles.menuSection}>
              {group.section}
            </div>
            
            {group.items.map((item) => {

              const Icon = item.icon;

              const active =
                pathname === item.path ||
                pathname.startsWith(item.path + "/");

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

          </div>

        ))}

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