"use client";

import { useEffect, useState } from "react";

interface Incident {
_id: string;
url: string;
status: "open" | "resolved";
startedAt: string;
resolvedAt?: string;
}

export default function Incidents() {

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const [incidents, setIncidents] = useState<Incident[]>([]);
const [loading, setLoading] = useState(true);

/* -----------------------------
LOAD INCIDENTS
----------------------------- */

useEffect(() => {

const projectId = localStorage.getItem("projectId");

if (!projectId) return;

fetch(`${API}/api/incidents/${projectId}`)
  .then(res => res.json())
  .then(data => {

    setIncidents(data?.data || []);

    setLoading(false);

  })
  .catch(() => setLoading(false));


}, []);

/* -----------------------------
INCIDENT DURATION
----------------------------- */

const getDuration = (start: string, end?: string) => {


const startTime = new Date(start).getTime();
const endTime = end ? new Date(end).getTime() : Date.now();

const diff = endTime - startTime;

const minutes = Math.floor(diff / 60000);
const seconds = Math.floor((diff % 60000) / 1000);

if (minutes > 0) return `${minutes}m ${seconds}s`;

return `${seconds}s`;


};

/* -----------------------------
LOADING STATE
----------------------------- */

if (loading) {


return (

  <div className="p-6">

    <h1 className="text-2xl font-semibold mb-6">
      Incidents
    </h1>

    <p className="text-gray-500">
      Loading incidents...
    </p>

  </div>

);


}

/* -----------------------------
EMPTY STATE
----------------------------- */

if (!incidents.length) {


return (

  <div className="p-6">

    <h1 className="text-2xl font-semibold mb-6">
      Incidents
    </h1>

    <div className="border rounded-lg p-8 text-center text-gray-500">

      No incidents detected yet.

    </div>

  </div>

);


}

/* -----------------------------
INCIDENT LIST
----------------------------- */

return (


<div className="p-6">

  <h1 className="text-2xl font-semibold mb-6">
    Incidents
  </h1>

  <div className="space-y-4">

    {incidents.map((incident) => (

      <div
        key={incident._id}
        className="border rounded-lg p-4 flex justify-between items-center"
      >

        <div>

          <p className="font-medium">
            {incident.url}
          </p>

          <p className="text-sm text-gray-500">

            Started: {new Date(incident.startedAt).toLocaleString()}

          </p>

          {incident.resolvedAt && (

            <p className="text-sm text-gray-500">

              Resolved: {new Date(incident.resolvedAt).toLocaleString()}

            </p>

          )}

          <p className="text-sm text-gray-500">

            Duration: {getDuration(incident.startedAt, incident.resolvedAt)}

          </p>

        </div>

        <div>

          {incident.status === "open" ? (

            <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded">

              Incident Active

            </span>

          ) : (

            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded">

              Resolved

            </span>

          )}

        </div>

      </div>

    ))}

  </div>

</div>


);

}
