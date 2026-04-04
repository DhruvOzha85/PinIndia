import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

export const getStates = () => api.get("/states").then((r) => r.data);
export const getDistricts = (state) => api.get(`/states/${state}/districts`).then((r) => r.data);
export const getTaluks = (state, district) =>
  api.get(`/states/${state}/districts/${district}/taluks`).then((r) => r.data);

export const getPincodes = (params) => api.get("/pincodes", { params }).then((r) => r.data);
export const searchPincodes = (q) => api.get("/search", { params: { q } }).then((r) => r.data);
export const getPincodeDetail = (pincode) => api.get(`/pincode/${pincode}`).then((r) => r.data);

export const getStats = () => api.get("/stats").then((r) => r.data);
export const getStateDistribution = () => api.get("/stats/state-distribution").then((r) => r.data);
export const getDeliveryDistribution = () =>
  api.get("/stats/delivery-distribution").then((r) => r.data);

export const getExportUrl = (params) => {
  const qs = new URLSearchParams(params).toString();
  return `/api/export${qs ? `?${qs}` : ""}`;
};

export default api;
