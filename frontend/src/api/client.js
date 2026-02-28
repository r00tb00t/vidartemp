import axios from "axios";

const BASE = process.env.REACT_APP_BACKEND_URL;

// IMPORTANT SECURITY NOTE:
// CRA exposes all REACT_APP_* values to the browser bundle; they are not secrets.
// The previous implementation read REACT_APP_INTERNAL_UI_SECRET and sent it as
// X-Internal-UI on every request, which is unsafe because it leaks any "secret"
// into client code.
//
// To preserve behavior where possible without shipping a secret in the bundle,
// we allow an optional *runtime-injected* token to be used, if present.
// Typical approaches include setting a global in index.html or injecting via the
// hosting environment at request-time (reverse proxy templating).
//
// If no runtime token is present, we simply omit X-Internal-UI.
// The backend must treat this as unauthenticated and handle accordingly.
const RUNTIME_INTERNAL_UI_TOKEN =
  (typeof window !== "undefined" &&
    window.__APP_CONFIG__ &&
    window.__APP_CONFIG__.INTERNAL_UI_TOKEN) ||
  (typeof window !== "undefined" && window.__INTERNAL_UI_TOKEN__) ||
  null;

// All dashboard calls go through the server-side BFF proxy.
// The API key is injected by the backend — it is never present in client code.
// The X-Internal-UI header authenticates the frontend to the BFF proxy (when provided).
const api = axios.create({
  baseURL: `${BASE}/api/internal`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the internal UI header only if a runtime token is available.
api.interceptors.request.use((config) => {
  if (RUNTIME_INTERNAL_UI_TOKEN) {
    config.headers = config.headers || {};
    config.headers["X-Internal-UI"] = RUNTIME_INTERNAL_UI_TOKEN;
  }
  return config;
});

export default api;

