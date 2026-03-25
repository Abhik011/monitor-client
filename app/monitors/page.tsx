"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Monitor {
  _id: string;
  name: string;
  url: string;
  lastStatus: "up" | "down";
  lastResponseTime: number;
  lastCheckedAt?: string;
}

interface Log {
  _id: string;
  responseTime: number;
  status: "up" | "down";
  createdAt: string;
}

export default function MonitorsPage() {

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);

  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  /* ---------------- FETCH MONITORS ---------------- */

  const fetchMonitors = async () => {

    try {

      const organizationId = localStorage.getItem("organizationId");
      const projectId = localStorage.getItem("projectId");

      if (!organizationId || !projectId) {
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${API}/api/monitors?organizationId=${organizationId}&projectId=${projectId}`
      );

      const data = await res.json();

      setMonitors(data?.data || []);

    } catch (err) {

      console.error("Monitor fetch error:", err);

    } finally {

      setLoading(false);

    }

  };

  /* ---------------- FETCH LOGS ---------------- */

  const fetchLogs = async (monitor: Monitor) => {

    try {

      const res = await fetch(`${API}/api/monitors/${monitor._id}/logs`);
      const data = await res.json();

      setLogs(data.data || []);
      setSelectedMonitor(monitor);

    } catch (err) {

      console.error("Log fetch error:", err);

    }

  };

  /* ---------------- AUTO REFRESH ---------------- */

  useEffect(() => {

    fetchMonitors();

    const interval = setInterval(() => {

      fetchMonitors();

      if (selectedMonitor) {
        fetchLogs(selectedMonitor);
      }

    }, 30000);

    return () => clearInterval(interval);

  }, []);

  /* ---------------- CREATE MONITOR ---------------- */

  const createMonitor = async () => {

    const organizationId = localStorage.getItem("organizationId");
    const projectId = localStorage.getItem("projectId");

    if (!name || !url) return;

    await fetch(`${API}/api/monitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organizationId,
        projectId,
        name,
        url
      })
    });

    setName("");
    setUrl("");

    fetchMonitors();

  };

  /* ---------------- DELETE MONITOR ---------------- */

  const deleteMonitor = async (id: string) => {

    await fetch(`${API}/api/monitors/${id}`, {
      method: "DELETE"
    });

    fetchMonitors();

  };

  /* ---------------- UPTIME CALC ---------------- */

  const calculateUptime = () => {

    if (!logs.length) return "0";

    const up = logs.filter(l => l.status === "up").length;

    return ((up / logs.length) * 100).toFixed(2);

  };

  if (loading) {
    return <div className="p-6">Loading monitors...</div>;
  }

  return (

    <div className="p-6 max-w-6xl">

      {/* TITLE */}

      <h1 className="text-2xl font-semibold mb-6">
        Monitors
      </h1>

      {/* CREATE MONITOR */}

      <div className="border rounded-xl p-5 mb-8 bg-white">

        <h2 className="font-medium mb-3">
          Add API Monitor
        </h2>

        <div className="flex gap-3">

          <input
            placeholder="Monitor Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border px-3 py-2 rounded w-1/3"
          />

          <input
            placeholder="https://api.example.com/health"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border px-3 py-2 rounded flex-1"
          />

          <button
            onClick={createMonitor}
            className="bg-black text-white px-5 py-2 rounded"
          >
            Add
          </button>

        </div>

      </div>

      {/* MONITOR LIST */}

      <div className="space-y-4">

        {monitors.map((monitor) => (

          <div
            key={monitor._id}
            className="border rounded-xl p-5 flex justify-between items-center hover:shadow cursor-pointer"
            onClick={() => fetchLogs(monitor)}
          >

            <div>

              <p className="font-semibold">
                {monitor.name}
              </p>

              <p className="text-sm text-gray-500">
                {monitor.url}
              </p>

              {monitor.lastCheckedAt && (

                <p className="text-xs text-gray-400">

                  Last check:{" "}
                  {new Date(monitor.lastCheckedAt).toLocaleTimeString()}

                </p>

              )}

            </div>

            <div className="flex items-center gap-5">

              {monitor.lastStatus === "up" ? (

                <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs">
                  UP
                </span>

              ) : (

                <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs">
                  DOWN
                </span>

              )}

              <div className="text-right">

                <div className="text-sm text-gray-500">
                  {monitor.lastResponseTime} ms
                </div>

              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMonitor(monitor._id);
                }}
                className="text-red-500 text-sm"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* CHART + STATS */}

      {selectedMonitor && (

        <div className="mt-10 border rounded-xl p-6 bg-white">

          <h2 className="font-semibold mb-4">
            {selectedMonitor.name} Metrics
          </h2>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="border rounded-lg p-4">
              <p className="text-xs text-gray-500">Uptime</p>
              <p className="text-xl font-semibold">
                {calculateUptime()}%
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-xs text-gray-500">Response</p>
              <p className="text-xl font-semibold">
                {selectedMonitor.lastResponseTime} ms
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <p className="text-xs text-gray-500">Status</p>

              {selectedMonitor.lastStatus === "up" ? (
                <p className="text-green-600 font-semibold">UP</p>
              ) : (
                <p className="text-red-600 font-semibold">DOWN</p>
              )}

            </div>

          </div>

          {/* CHART */}

          <div style={{ width: "100%", height: 250 }}>

            <ResponsiveContainer>

              <LineChart data={[...logs].reverse()}>

                <XAxis
                  dataKey="createdAt"
                  tickFormatter={(t) =>
                    new Date(t).toLocaleTimeString()
                  }
                />

                <Tooltip
                  labelFormatter={(l) =>
                    new Date(l).toLocaleString()
                  }
                />

                <Line
                  type="monotone"
                  dataKey="responseTime"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={false}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* LOG TABLE */}

          <div className="mt-6">

            <h3 className="font-medium mb-3">
              Latest Checks
            </h3>

            <table className="w-full text-sm">

              <thead>

                <tr className="text-left border-b">

                  <th className="py-2">Time</th>
                  <th>Status</th>
                  <th>Response</th>

                </tr>

              </thead>

              <tbody>

                {logs.slice(0, 10).map((log) => (

                  <tr key={log._id} className="border-b">

                    <td className="py-2">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td>
                      {log.status === "up" ? "🟢 UP" : "🔴 DOWN"}
                    </td>

                    <td>
                      {log.responseTime} ms
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      )}

    </div>

  );

}