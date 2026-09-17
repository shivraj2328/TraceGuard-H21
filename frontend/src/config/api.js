const rawBackendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const BACKEND_URL = rawBackendUrl.replace(/\/+$/, "");
export const API_BASE = `${BACKEND_URL}/api/v1`;
