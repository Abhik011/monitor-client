import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export function useRealtimeEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {

    socket.on("event", (data) => {
      setEvents((prev) => [data, ...prev]);
    });

  }, []);

  return events;
}