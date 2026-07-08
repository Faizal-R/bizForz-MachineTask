import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:7000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Sends HTTP-only cookies automatically
});

let isLoggingOut = false;

export function handleLogout() {
  isLoggingOut = true;
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
}

export async function performLogout() {
  isLoggingOut = true;
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.warn("Logout API call failed:", error);
  } finally {
    isLoggingOut = false;
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  }
}

apiClient.interceptors.request.use(
  (config) => {
    if (isLoggingOut) {
      return Promise.reject(new Error("Logging out"));
    }
    // No Authorization header needed — token is in HTTP-only cookie
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isLoggingOut) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      handleLogout();
      return Promise.reject(error);
    }

    if (
      error.response?.status === 403 &&
      !error.config?.url?.includes("/auth/signin")
    ) {
      if (typeof window !== "undefined") {
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("app:navigate", { detail: "/unauthorized" }));
        }, 3000);
      }
    }

    if (error.response?.status === 423 && !error.config?.url?.includes("/auth")) {
      setTimeout(() => {
        handleLogout();
      }, 1000);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
