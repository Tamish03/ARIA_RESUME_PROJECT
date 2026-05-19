import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";

let apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Ensure the API URL ends with /api
if (apiURL && !apiURL.endsWith("/api") && !apiURL.endsWith("/api/")) {
  apiURL = apiURL.replace(/\/$/, "") + "/api";
}

const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default api;
