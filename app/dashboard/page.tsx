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
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);

  /* --------------------------
     FETCH EVENTS
  -------------------------- */

  const loadEvents = () => {
    fetch("https://monitor.creonox.com/track")
      .then((res) => res.json())
      .then((data) => setEvents(data));
  };

  useEffect(() => {
    loadEvents();

    const interval = setInterval(loadEvents, 5000);

    return () => clearInterval(interval);
  }, []);



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

  const sessionData = Object.keys(sessions).slice(0, 10).map((id) => ({
    session: id.slice(0, 6),
    events: sessions[id],
  }));

  /* --------------------------
     ERROR LIST
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
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        Monitoring Dashboard
      </h1>

      {/* METRICS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 20,
          marginBottom: 40,
        }}
      >
        <Card title="Total Events" value={totalEvents} />
        <Card title="JS Errors" value={errors.length} />
        <Card title="API Errors" value={apiErrors.length} />
        <Card title="Slow APIs" value={slowApis.length} />
      </div>

      {/* CHARTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 40,
        }}
      >
        {/* LATENCY */}

        <div>
          <h3>API Latency</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="latency"
                stroke="#6366f1"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* EVENT TYPES */}

        <div>
          <h3>Event Types</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={typeChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COUNTRY ERRORS */}

      <div style={{ marginTop: 50 }}>
        <h2>Errors by Country</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={countryChart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="country" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SESSION EVENTS */}

      <div style={{ marginTop: 50 }}>
        <h2>Session Activity</h2>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={sessionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="session" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="events" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ERROR LOGS */}

      <div style={{ marginTop: 50 }}>
        <h2>Error Logs</h2>

        {Object.keys(errorsByPage).slice(0, 5).map((page) => (

          <div key={page} style={{ marginTop: 20 }}>

            <h3 style={{ marginBottom: 10 }}>
              Page: {page}
            </h3>

            {errorsByPage[page].slice(0, 5).map((event: any) => (

              <div
                key={event._id}
                style={{
                  border: "1px solid #ddd",
                  padding: 12,
                  marginTop: 10,
                  borderRadius: 8,
                  background: "#fff5f5",
                }}
              >

                <b style={{ color: "red" }}>
                  {event.type.toUpperCase()}
                </b>

                <div>
                  {event.message || event.api}
                </div>

                <div style={{ fontSize: 12 }}>
                  Status: {event.status || "-"}
                </div>

                <div style={{ fontSize: 12 }}>
                  Country: {event.country || "Unknown"}
                </div>

              </div>

            ))}

          </div>

        ))}
      </div>
    </div>
  );
}

/* --------------------------
   CARD
-------------------------- */

function Card({ title, value }: any) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 20,
        borderRadius: 8,
        background: "#fafafa",
      }}
    >
      <div style={{ fontSize: 14 }}>{title}</div>

      <div
        style={{
          fontSize: 26,
          fontWeight: "bold",
        }}
      >
        {value}
      </div>
    </div>
  );
}