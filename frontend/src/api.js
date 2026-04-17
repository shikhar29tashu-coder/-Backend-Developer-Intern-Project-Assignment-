import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api/v1';

const createClient = (token) =>
  axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': 'application/json',
    },
  });

export const register = (payload) => createClient().post('/auth/register', payload);
export const login = (payload) => createClient().post('/auth/login', payload);
export const getTasks = (token) => createClient(token).get('/tasks');
export const createTask = (token, payload) => createClient(token).post('/tasks', payload);
export const updateTask = (token, id, payload) => createClient(token).put(`/tasks/${id}`, payload);
export const deleteTask = (token, id) => createClient(token).delete(`/tasks/${id}`);
export const getTask = (token, id) => createClient(token).get(`/tasks/${id}`);
