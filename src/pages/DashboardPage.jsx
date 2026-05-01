import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import ItemModal from '../components/ItemModal';
import { useItems } from '../hooks/useItems';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('TASK');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { items, loading, error, addItem, editItem, removeItem, toggleItem, reorder } = useItems();

  const handleToggleDark = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : '');
      return next;
    });
  };

  const allTags = useMemo(() => {
    const tags = new Set();
    items.forEach((item) => item.tags?.forEach((tag) => tags.add(tag)));
    return [...tags];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab = item.type === activeTab;
      const matchesSearch = search
        ? item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.content?.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesTag = activeTag ? item.tags?.includes(activeTag) : true;
      return matchesTab && matchesSearch && matchesTag;
    });
  }, [items, activeTab, search, activeTag]);

  // Stats
  const tasks = items.filter(i => i.type === 'TASK');
  const completed = tasks.filter(i => i.completed).length;
  const notes = items.filter(i => i.type === 'NOTE');
  const completionRate = tasks.length > 0
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const handleOpenCreate = () => { setEditingItem(null); setModalOpen(true); };
  const handleOpenEdit = (item) => { setEditingItem(item); setModalOpen(true); };
  const handleSubmit = async (payload) => {
    if (editingItem) await editItem(editingItem.id, payload);
    else await addItem(payload);
  };
  const handleDelete = async (id) => {
    if (window.confirm('Delete this item?')) await removeItem(id);
  };
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedIds = Array.from(filteredItems);
    const [moved] = reorderedIds.splice(result.source.index, 1);
    reorderedIds.splice(result.destination.index, 0, moved);
    reorder(reorderedIds.map((item) => item.id));
  };

  return (
    <div className={styles.page}>
      <Navbar darkMode={darkMode} onToggleDark={handleToggleDark} />

      <div className={styles.content}>

        {/* Stats bar */}
        <div className={styles.statsBar}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Total Tasks</span>
            <span className={styles.statValue}>{tasks.length}</span>
            <span className={styles.statSub}>{completed} completed</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Completion</span>
            <span className={styles.statValue}>{completionRate}%</span>
            <span className={styles.statSub}>of all tasks done</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>Notes</span>
            <span className={styles.statValue}>{notes.length}</span>
            <span className={styles.statSub}>saved notes</span>
          </div>
        </div>

        {/* Top bar */}
        <div className={styles.topBar}>
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search tasks and notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.newBtn} onClick={handleOpenCreate}>
            + New
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['TASK', 'NOTE'].map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'TASK' ? '✅ Tasks' : '📝 Notes'}
            </button>
          ))}
        </div>

        {/* Tag filters */}
        {allTags.length > 0 && (
          <div className={styles.tagFilters}>
            <button
              className={`${styles.tagChip} ${activeTag === '' ? styles.tagChipActive : ''}`}
              onClick={() => setActiveTag('')}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`${styles.tagChip} ${activeTag === tag ? styles.tagChipActive : ''}`}
                onClick={() => setActiveTag(activeTag === tag ? '' : tag)}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Items */}
        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="items">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {filteredItems.length === 0 ? (
                    <div className={styles.empty}>
                      <div className={styles.emptyIcon}>
                        {activeTab === 'TASK' ? '✅' : '📝'}
                      </div>
                      <p className={styles.emptyText}>
                        No {activeTab.toLowerCase()}s yet
                      </p>
                      <p className={styles.emptySubtext}>
                        Click <strong>+ New</strong> to create one
                      </p>
                    </div>
                  ) : (
                    filteredItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <ItemCard
                              item={item}
                              onEdit={handleOpenEdit}
                              onDelete={handleDelete}
                              onToggle={toggleItem}
                              dragHandleProps={provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      <ItemModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editingItem={editingItem}
      />
    </div>
  );
}