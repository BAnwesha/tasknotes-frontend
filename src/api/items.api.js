import axiosClient from './axiosClient';

export const getItems = (params) => axiosClient.get('/items', { params });
export const getItemById = (id) => axiosClient.get(`/items/${id}`);
export const createItem = (data) => axiosClient.post('/items', data);
export const updateItem = (id, data) => axiosClient.put(`/items/${id}`, data);
export const toggleComplete = (id) => axiosClient.patch(`/items/${id}/toggle`);
export const reorderItems = (orderedIds) => axiosClient.patch('/items/reorder', { orderedIds });
export const deleteItem = (id) => axiosClient.delete(`/items/${id}`);