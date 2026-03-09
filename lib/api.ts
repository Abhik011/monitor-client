const API = process.env.NEXT_PUBLIC_API_URL;

export async function api(path, method = "GET", data = null) {

  const token = localStorage.getItem("token");

  const res = await fetch(API + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? "Bearer " + token : ""
    },
    body: data ? JSON.stringify(data) : null
  });

  return res.json();
}