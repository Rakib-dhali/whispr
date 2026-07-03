import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "developement"? "https://localhosa:3000": "/api",
    withCredentials: true,
})