import axios from "axios";

const API = axios.create({
    baseURL: "https://infinite-stones.onrender.com/api"
});

export const registerUser = async (userData) => {
    return await API.post("/auth/register", userData);
};