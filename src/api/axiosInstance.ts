import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";
import { AxiosCustomConfig } from "../types";

export const createAxiosInstance = (config: AxiosCustomConfig): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: config.baseUrl || "",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    withCredentials: config.enableCookies || false,
  });

  // Request Interceptor
  axiosInstance.interceptors.request.use(
    (reqConfig) => {
      // Add X-Request-Id
      if (config.enableRequestId) {
        const requestId =
          typeof config.customRequestId === "function"
            ? config.customRequestId()
            : config.customRequestId || uuidv4();
        reqConfig.headers["X-Request-Id"] = requestId;
      }

      // Add TabId
      if (config.enableTabId) {
        reqConfig.headers["TabId"] = config.customTabId || window.name;
      }

      // Add X-XSRF-TOKEN
      if (config.enableXSRFToken && config.xsrfTokenFunction) {
        reqConfig.headers["X-XSRF-TOKEN"] = config.xsrfTokenFunction();
      }

      return reqConfig;
    },
    (error: any) => {
      return Promise.reject(new Error(error.message ?? "Something went wrong"));
    },
  );

  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (config.enableXSRFToken) {
        const xsrfToken = response.headers["xsrf-token"];
        if (xsrfToken) {
          localStorage.setItem("X-XSRF-TOKEN", xsrfToken);
        }
      }
      return response;
    },
    async (error: AxiosError) => {
      const excludedRoutes = config.excludedRoutes || [];
      const redirectOnErrors = config.redirectOnErrors || [401, 403, 429];
      const redirectUrl = config.redirectUrl || "/login";

      if (config.enableXSRFToken) {
        const xsrfToken = error.response?.headers["xsrf-token"];
        if (xsrfToken) {
          localStorage.setItem("X-XSRF-TOKEN", xsrfToken);
        }
      }

      if (
        error.response &&
        redirectOnErrors.includes(error.response.status) &&
        !excludedRoutes.includes(error?.config?.url || "")
      ) {
        window.location.href = redirectUrl;
      }

      return Promise.reject(error);
    },
  );

  return axiosInstance;
};
