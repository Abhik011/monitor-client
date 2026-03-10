"use client";

import { Bell, Search, Moon, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
export default function Header() {

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    const [organizationName, setOrganizationName] = useState("Organization");
    const [usage, setUsage] = useState<any>(null);
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<any>(null);

    const toggleTheme = () => {
        document.documentElement.classList.toggle("dark");
    };

    /* -----------------------------
       LOAD ORGANIZATION
    ----------------------------- */

    useEffect(() => {

        const token = localStorage.getItem("token");
        const organizationId = localStorage.getItem("organizationId");

        const storedOrg = localStorage.getItem("organizationName");

        if (storedOrg) {
            setOrganizationName(storedOrg);
            return;
        }

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

    }, [API]);

    /* -----------------------------
       LOAD USAGE
    ----------------------------- */

    useEffect(() => {

        const token = localStorage.getItem("token");

        fetch(`${API}/billing/usage`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(setUsage);

    }, [API]);

    /* -----------------------------
       CLOSE DROPDOWN OUTSIDE CLICK
    ----------------------------- */

    useEffect(() => {

        function handleClick(e: any) {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setOpenMenu(false);
            }

        }

        document.addEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick);

    }, []);

    return (

        <div style={styles.header}>

            {/* SEARCH */}

            <div style={styles.searchBox}>

                <Search size={16} />

                <input
                    placeholder="Search..."
                    style={styles.searchInput}
                />

            </div>

            {/* RIGHT */}

            <div style={styles.actions}>

                <button style={styles.iconBtn}>
                    <Bell size={15} />
                </button>

                <button style={styles.iconBtn} onClick={toggleTheme}>
                    <Moon size={15} />
                </button>

                {/* ORG */}

                <div style={styles.left} ref={dropdownRef}>

                    <div
                        style={styles.orgBadge}
                        onClick={() => setOpenMenu(!openMenu)}
                    >

                        {organizationName}

                        <ChevronDown size={16} style={{ marginLeft: 6 }} />

                    </div>

                    {openMenu && (

                        <div style={styles.dropdown}>
                            <div style={styles.dropdownSection}>
                                <div style={styles.label}>Account ID</div>
                                <div style={styles.value}>xxxx-xxxx-xxxx</div>

                                <div style={styles.label}>Account name</div>
                                <div style={styles.value}>{organizationName}</div>

                                <div style={styles.label}>IAM user</div>
                                <div style={styles.value}>Abhijeetk@1720</div>
                            </div>

                            {/* USAGE */}

                            {usage && (

                                <div style={styles.usageBox}>

                                    <div style={{ fontSize: 13 }}>

                                        {usage.used.toLocaleString()} / {usage.limit.toLocaleString()} events

                                    </div>

                                    <div style={styles.bar}>

                                        <div
                                            style={{
                                                ...styles.progress,
                                                width: `${usage.percent}%`
                                            }}
                                        />

                                    </div>

                                </div>

                            )}

                            <div style={styles.divider}></div>

                            <div style={styles.menuItem}>Account</div>

                            <div style={styles.menuItem}>Organization</div>

                            <div style={styles.menuItem} onClick={() => router.push("/upgrade")}>Upgrade</div>

                            <div style={styles.menuItem}>Billing</div>

                            <div style={styles.menuItem}>Security</div>

                            <div style={styles.divider}></div>

                            <button style={styles.signOut}>
                                Log out
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

const styles: any = {

    header: {
        position: "sticky",
        top: 0,
        height: 70,
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        zIndex: 100
    },

    left: {
        display: "flex",
        alignItems: "center",
        position: "relative"
    },

    orgBadge: {
        background: "#eef2f7",
        borderRadius: 8,
        padding: "6px 12px",
        fontSize: 12,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        cursor: "pointer"
    },

    dropdown: {
        position: "absolute",
        right: 0,
        top: 55,
        width: 280,
        background: "#fff",
        borderRadius: 10,
        padding: 16,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        zIndex: 999
    },

    dropdownSection: {
        marginBottom: 10
    },

    label: {
        fontSize: 12,
        color: "#6b7280"
    },

    value: {
        fontSize: 14,
        fontWeight: 600
    },

    usageBox: {
        marginTop: 10
    },

    bar: {
        height: 6,
        background: "#e5e7eb",
        borderRadius: 4,
        marginTop: 4
    },

    progress: {
        height: 6,
        background: "#7c3aed",
        borderRadius: 4
    },

    divider: {
        height: 1,
        background: "#e5e7eb",
        margin: "12px 0"
    },

    menuItem: {
        padding: "8px 0",
        cursor: "pointer",
        fontSize: 14
    },

    signOut: {
        width: "100%",
        marginTop: 10,
        padding: "10px",
        borderRadius: 8,
        border: "none",
        background: "#7c3aed",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer"
    },

    searchBox: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        padding: "8px 12px",
        borderRadius: 8,
        width: 280
    },

    searchInput: {
        border: "none",
        outline: "none",
        background: "transparent",
        width: "100%"
    },

    actions: {
        display: "flex",
        alignItems: "center",
        gap: 15
    },

    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
    }

};