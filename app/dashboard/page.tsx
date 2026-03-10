"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ReferenceLine,
  AreaChart,
  Area,
  ResponsiveContainer,
  Cell
} from "recharts";
import io from "socket.io-client";

export default function Dashboard() {

  const [events, setEvents] = useState<any[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL;

  /* --------------------------
     LOAD PROJECT
  -------------------------- */

  useEffect(() => {

    const storedProject = localStorage.getItem("projectId");

    if (storedProject) {
      setProjectId(storedProject);
    }

  }, []);

  /* --------------------------
     FETCH EVENTS
  -------------------------- */

  const loadEvents = async () => {

    if (!projectId) return;

    const token = localStorage.getItem("token");

    const res = await fetch(
      `${API}/events?projectId=${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    setEvents(data.events || []);

  };

  /* --------------------------
     SOCKET REALTIME
  -------------------------- */

  useEffect(() => {

    const socket = io(API);

    socket.on("new-event", (event) => {

      if (event.projectId === projectId) {

        setEvents((prev) => [event, ...prev]);

      }

    });

    return () => {
      socket.disconnect();
    };

  }, [projectId]);

  /* --------------------------
     AUTO REFRESH
  -------------------------- */

  useEffect(() => {

    loadEvents();

    const interval = setInterval(loadEvents, 5000);

    return () => clearInterval(interval);

  }, [projectId]);

  /* --------------------------
     METRICS
  -------------------------- */

  const totalEvents = events.length;

  const errors = events.filter((e) => e.type === "error");

  const apiErrors = events.filter(
    (e) => e.type === "api_error" || (e.type === "api" && e.status >= 400)
  );

  const slowApis = events.filter(
    (e) => e.type === "api" && e.latency && e.latency > 2000
  );

  /* --------------------------
     LATENCY CHART
  -------------------------- */

  const chartData = events.slice(0, 20).map((e, i) => ({
    name: i,
    latency: e.latency || 0,
  }));

  /* --------------------------
     EVENT TYPE CHART
  -------------------------- */

  const typeCount: any = {};

  events.forEach((e) => {
    typeCount[e.type] = (typeCount[e.type] || 0) + 1;
  });

  const typeChart = Object.keys(typeCount).map((key) => ({
    type: key,
    value: typeCount[key],
  }));

  /* --------------------------
     COUNTRY ERROR STATS
  -------------------------- */

  const countryCount: any = {};

  events
    .filter((e) => e.type === "error" || (e.type === "api" && e.status >= 400))
    .forEach((e) => {

      const country = e.country || "Unknown";

      countryCount[country] = (countryCount[country] || 0) + 1;

    });

  const countryChart = Object.keys(countryCount).map((c) => ({
    country: c,
    value: countryCount[c],
  }));

  /* --------------------------
     SESSION STATS
  -------------------------- */

  const sessions: any = {};

  events.forEach((e) => {

    if (!e.sessionId) return;

    sessions[e.sessionId] = (sessions[e.sessionId] || 0) + 1;

  });

  const sessionData = Object.keys(sessions)
    .slice(0, 10)
    .map((id) => ({
      session: id.slice(0, 6),
      events: sessions[id],
    }));

  /* --------------------------
     ERROR GROUPING
  -------------------------- */

  const errorEvents = events.filter(
    (e) =>
      e.type === "error" ||
      e.type === "api_error" ||
      (e.type === "api" && e.status >= 400)
  );

  const errorsByPage: any = {};

  errorEvents.forEach((e) => {

    const page = e.page || "Unknown";

    if (!errorsByPage[page]) {

      errorsByPage[page] = [];

    }

    errorsByPage[page].push(e);

  });

  return (
    <div style={styles.wrapper}>
      {/* MAIN */}

      <div style={styles.main}>

        <h1 style={styles.title}>Monitoring Dashboard</h1>

        {/* METRICS */}

        <div style={styles.metricGrid}>

          <Card title="Total Events" value={totalEvents} />
          <Card title="JS Errors" value={errors.length} />
          <Card title="API Errors" value={apiErrors.length} />
          <Card title="Slow APIs" value={slowApis.length} />

        </div>

        {/* CHARTS */}

        <div style={styles.chartGrid}>

          <ChartCard title="API Latency">

            <ResponsiveContainer width="100%" height={250}>

              <AreaChart data={chartData}>

                <defs>

                  <linearGradient id="goodLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>

                  <linearGradient id="badLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>

                </defs>

                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  tickLine={true}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={6}
                />

                <YAxis
                  stroke="#9ca3af"
                  tickLine={true}
                  axisLine={false}
                  width={30}
                  tick={{ fontSize: 10 }}
                  tickMargin={6}
                  tickFormatter={(v) => `${v}ms`}
                />

                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="latency"
                  stroke={(chartData.some(d => d.latency > 2000)) ? "#ef4444" : "#3b82f6"}
                  strokeWidth={3}
                  fill={(chartData.some(d => d.latency > 2000)) ? "url(#badLatency)" : "url(#goodLatency)"}
                  dot={false}
                />

              </AreaChart>

            </ResponsiveContainer>

          </ChartCard>

          <ChartCard title="Event Types" >

            <ResponsiveContainer width="100%" height={250}>

              <BarChart data={typeChart}>

                <XAxis
                  dataKey="type"
                  axisLine={false}
                  tickLine={false}
                  stroke="#8b98ae"
                   tick={{ fontSize: 10 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  stroke="#9ca3af"
                   tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 8
                  }}
                />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                >
                  {typeChart.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.type === "error"
                          ? "#ef4444"
                          : entry.type === "api_error"
                            ? "#f59e0b"
                            : "#6366f1"
                      }
                    />
                  ))}
                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </ChartCard>

        </div>

        {/* COUNTRY */}

        <ChartCard title="Errors by Country">

          <ResponsiveContainer width="100%" height={250}>

            <BarChart data={countryChart}>

              <CartesianGrid stroke="#333" />

              <XAxis dataKey="country" stroke="#aaa" />
              <YAxis stroke="#aaa" />

              <Tooltip />

              <Bar dataKey="value" fill="#f43f5e" />

            </BarChart>

          </ResponsiveContainer>

        </ChartCard>

      </div>

    </div>
  );
}

/* --------------------------
   COMPONENTS
-------------------------- */

function Card({ title, value }: any) {

  return (
    <div style={styles.card}>

      <div style={styles.cardTitle}>{title}</div>

      <div style={styles.cardValue}>{value}</div>

    </div>
  );

}

function ChartCard({ title, children }: any) {

  return (
    <div style={styles.chartCard}>

      <h3 style={{
          marginBottom: 10,
          fontSize: 14,
          fontWeight: 600,
          color: "#374151",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "0.2px"
        }}
        >
          {title}
          </h3>

      {children}

    </div>
  );

}

/* --------------------------
   STYLES
-------------------------- */
const styles: any = {

  wrapper: {
    display: "flex",
    // background: "#f8fafc",
    color: "#111827",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
  },

  main: {
    flex: 1,
    padding: 40,
  },

  title: {
    fontSize: 28,
    fontWeight: 600,
    marginBottom: 30,
  },

  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 20,
    marginBottom: 40,
  },

  chartGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30,
  },

  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },

  cardTitle: {
    fontSize: 13,
    color: "#6b7280",
  },

  cardValue: {
    fontSize: 26,
    fontWeight: 700,
    marginTop: 8,
  },

  chartCard: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    marginTop: 20,
  }

};