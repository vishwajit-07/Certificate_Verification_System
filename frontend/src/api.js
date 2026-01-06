const API_BASE = "http://localhost:5000/api";

export const api = {
  post: async (path, body) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body)
    });
    return res.json();
  },
  get: async (path) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      credentials: "include"
    });
    return res.json();
  },
  download: async (path) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      credentials: "include"
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    return blob;
  },
  postFormData: async (path, formData) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      credentials: "include",
      body: formData
    });
    return res.json();
  },
  delete: async (path) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },
};
