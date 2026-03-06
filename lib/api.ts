export async function fetchEvents() {

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MONITOR_API}/events`
  );

  return res.json();
}