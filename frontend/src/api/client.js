import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;
const INTERNAL_UI_SECRET = process.env.REACT_APP_INTERNAL_UI_SECRET;

// All dashboard calls go through the server-side BFF proxy.
// The API key is injected by the backend — it is never present in client code.
// The X-Internal-UI header authenticates the frontend to the BFF proxy.
const api = axios.create({
  baseURL: `${BASE}/api/internal`,
  headers: {
    "Content-Type": "application/json",
    "X-Internal-UI": INTERNAL_UI_SECRET,
  },
});

export default api;
