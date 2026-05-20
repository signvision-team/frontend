import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getLevels = async (userId) => {
  const res = await API.get(`/levels/${userId}`);
  return res.data;
};

export const addXP = async (userId, xp) => {
  const res = await API.post(`/add-xp/${userId}?earned_xp=${xp}`);
  return res.data;
};