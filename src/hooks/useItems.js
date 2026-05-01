import { useState, useEffect, useCallback } from 'react';
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  toggleComplete,
  reorderItems,
} from '../api/items.api';

export function useItems(filters = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getItems(filters);
      setItems(response.data);
    } catch (err) {
      setError('Failed to load items');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (data) => {
    const response = await createItem(data);
    setItems((prev) => [...prev, response.data]);
  };

  const editItem = async (id, data) => {
    const response = await updateItem(id, data);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? response.data : item))
    );
  };

  const removeItem = async (id) => {
    await deleteItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleItem = async (id) => {
    const response = await toggleComplete(id);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? response.data : item))
    );
  };

  const reorder = async (orderedIds) => {
    await reorderItems(orderedIds);
    const reordered = orderedIds.map((id) =>
      items.find((item) => item.id === id)
    );
    setItems(reordered);
  };

  return {
    items,
    loading,
    error,
    addItem,
    editItem,
    removeItem,
    toggleItem,
    reorder,
    refetch: fetchItems,
  };
}