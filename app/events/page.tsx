"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

import "./monitor-dashboard.css";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://monitor.creonox.com/data";

// ✅ correct socket (IMPORTANT)
const socket = io("https://monitor.creonox.com");

type Event = {
  _id: string;
  type: string;
  page: string;
  ip: string;
  country: string;
  sessionId: string;
  fingerprint: string;
  createdAt: string;
};

export default function MonitoringDashboard() {

  const [events, setEvents] = useState<Event[]>([]);
  const [filtered, setFiltered] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* -----------------------------
     LOAD EVENTS
  ----------------------------- */

  useEffect(() => {

    async function loadEvents() {

      try {

        const token = localStorage.getItem("token");
        const projectId = localStorage.getItem("projectId");

        const res = await fetch(
          `${API}/events?projectId=${projectId}&limit=500`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.events) {
          setEvents(data.events);
          setFiltered(data.events);
        }

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    }

    loadEvents();

  }, []);

  /* -----------------------------
     REALTIME
  ----------------------------- */

useEffect(() => {
  const handler = (event: Event) => {
    setEvents(prev => [event, ...prev]);
  };

  socket.on("event:new", handler);

  // ✅ CLEANUP FUNCTION
  return () => {
    socket.off("event:new", handler);
  };
}, []);

  /* -----------------------------
     FILTER LOGIC
  ----------------------------- */

  useEffect(() => {

    let data = [...events];

    if (search) {
      data = data.filter(e =>
        e.page?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      data = data.filter(e => e.type === type);
    }

    if (country) {
      data = data.filter(e => e.country === country);
    }

    if (from) {
      data = data.filter(e =>
        new Date(e.createdAt) >= new Date(from)
      );
    }

    if (to) {
      data = data.filter(e =>
        new Date(e.createdAt) <= new Date(to)
      );
    }

    setFiltered(data);

  }, [search, type, country, from, to, events]);

  /* -----------------------------
     ANALYTICS
  ----------------------------- */

  const total = filtered.length;

  const uniqueUsers =
    new Set(filtered.map(e => e.fingerprint)).size;

  const sessions =
    new Set(filtered.map(e => e.sessionId)).size;

  /* -----------------------------
     CHART DATA
  ----------------------------- */

  const pageviewsByDay: any = {};

  filtered.forEach(e => {
    const day = new Date(e.createdAt).toLocaleDateString();
    pageviewsByDay[day] = (pageviewsByDay[day] || 0) + 1;
  });

  const chartData = Object.entries(pageviewsByDay).map(
    ([date, views]) => ({
      date,
      views
    })
  );

  const countryMap: any = {};

  filtered.forEach(e => {
    countryMap[e.country] =
      (countryMap[e.country] || 0) + 1;
  });

  const countryData = Object.entries(countryMap).map(
    ([country, count]) => ({
      country,
      count
    })
  );

  /* -----------------------------
     UI
  ----------------------------- */

  if (loading) {
    return <p>Loading monitoring data...</p>;
  }

  return (

    <div className="monitor-dashboard">

      <h1>Events</h1>

      {/* FILTERS */}

      <div className="filters">

        <input
          placeholder="Search page..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="pageview">Pageview</option>
          <option value="click">Click</option>
          <option value="api">API</option>
        </select>

        <input
          placeholder="Country"
          onChange={e => setCountry(e.target.value)}
        />

        <input type="date" onChange={e => setFrom(e.target.value)} />
        <input type="date" onChange={e => setTo(e.target.value)} />

      </div>

      {/* STATS */}

      <div className="stats">

        <div className="stat">
          <h3>Total Events</h3>
          <p>{total}</p>
        </div>

        <div className="stat">
          <h3>Unique Visitors</h3>
          <p>{uniqueUsers}</p>
        </div>

        <div className="stat">
          <h3>Sessions</h3>
          <p>{sessions}</p>
        </div>

      </div>

      {/* CHARTS */}

      <h2>Pageviews</h2>

      <LineChart width={800} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="views" stroke="#8b5cf6" />
      </LineChart>

      <h2>Visitors by Country</h2>

      <BarChart width={800} height={300} data={countryData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="country" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#6366f1" />
      </BarChart>

      {/* REALTIME FEED */}

      <h2>Live Events</h2>

      <div className="timeline">

        {filtered.slice(0, 50).map(e => (

          <div key={e._id} className="timeline-item">

            <strong className={`badge ${e.type}`}>
              {e.type}
            </strong>

            <p>{e.page}</p>

            <small>{e.country} • {e.ip}</small>

            <div>
              {new Date(e.createdAt).toLocaleString()}
            </div>

          </div>

        ))}

      </div>

    </div>

  );
}