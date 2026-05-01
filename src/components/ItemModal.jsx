import { useState, useEffect } from 'react';
import styles from './ItemModal.module.css';

const defaultForm = {
  type: 'TASK',
  title: '',
  content: '',
  priority: 'MEDIUM',
  dueDate: '',
  tags: '',
};

export default function ItemModal({ isOpen, onClose, onSubmit, editingItem }) {
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setForm({
        type: editingItem.type,
        title: editingItem.title,
        content: editingItem.content || '',
        priority: editingItem.priority || 'MEDIUM',
        dueDate: editingItem.dueDate
          ? new Date(editingItem.dueDate).toISOString().split('T')[0]
          : '',
        tags: editingItem.tags?.join(', ') || '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setLoading(true);
    try {
      const payload = {
        type: form.type,
        title: form.title.trim(),
        content: form.content.trim(),
        priority: form.type === 'TASK' ? form.priority : null,
        dueDate: form.type === 'TASK' && form.dueDate ? new Date(form.dueDate).toISOString() : null,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await onSubmit(payload);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {editingItem ? 'Edit item' : 'New item'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Type</label>
            <div className={styles.typeToggle}>
              {['TASK', 'NOTE'].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`${styles.typeBtn} ${form.type === t ? styles.typeBtnActive : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, type: t }))}
                >
                  {t === 'TASK' ? '✅ Task' : '📝 Note'}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              className={styles.input}
              value={form.title}
              onChange={handleChange}
              placeholder={form.type === 'TASK' ? 'What needs to be done?' : 'Untitled note'}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              className={styles.textarea}
              value={form.content}
              onChange={handleChange}
              placeholder="Add details..."
            />
          </div>

          {form.type === 'TASK' && (
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  className={styles.select}
                  value={form.priority}
                  onChange={handleChange}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="dueDate">Due date</label>
                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  className={styles.input}
                  value={form.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="tags">
              Tags <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>(comma separated)</span>
            </label>
            <input
              id="tags"
              name="tags"
              className={styles.input}
              value={form.tags}
              onChange={handleChange}
              placeholder="work, urgent, personal"
            />
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading || !form.title.trim()}>
              {loading ? 'Saving...' : editingItem ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}