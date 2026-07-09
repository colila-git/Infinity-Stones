import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3000/api"
});

export const registerUser = async (userData) => {
    return await API.post("/auth/register", userData);
};