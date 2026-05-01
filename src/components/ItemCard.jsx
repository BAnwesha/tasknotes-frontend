import styles from "./ItemCard.module.css";

export default function ItemCard({
  item,
  onEdit,
  onDelete,
  onToggle,
  dragHandleProps,
  isDragging,
}) {
  const isOverdue =
    item.dueDate && !item.completed && new Date(item.dueDate) < new Date();

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const borderClass =
    item.type === "NOTE"
      ? styles.cardNote
      : item.priority === "HIGH"
        ? styles.cardHighPriority
        : item.priority === "MEDIUM"
          ? styles.cardMediumPriority
          : styles.cardLowPriority;

  return (
    <div
      className={`${styles.card} ${borderClass} ${isDragging ? styles.cardDragging : ""}`}
      {...dragHandleProps}
    >
      <div className={styles.header}>
        {item.type === "TASK" && (
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={item.completed}
            onChange={() => onToggle(item.id)}
          />
        )}
        <span
          className={`${styles.title} ${item.completed ? styles.titleCompleted : ""}`}
        >
          {item.title}
        </span>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => onEdit(item)}
            title="Edit"
          >
            ✏️
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => onDelete(item.id)}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {item.content && <p className={styles.content}>{item.content}</p>}

      {(item.priority || item.dueDate) && (
        <div className={styles.meta}>
          {item.priority && (
            <span
              className={`${styles.priority} ${
                item.priority === "HIGH"
                  ? styles.priorityHigh
                  : item.priority === "MEDIUM"
                    ? styles.priorityMedium
                    : styles.priorityLow
              }`}
            >
              {item.priority}
            </span>
          )}
          {item.dueDate && (
            <span
              className={`${styles.dueDate} ${isOverdue ? styles.dueDateOverdue : ""}`}
            >
              📅 {isOverdue ? "Overdue · " : ""}
              {formatDate(item.dueDate)}
            </span>
          )}
        </div>
      )}

      {item.tags?.length > 0 && (
        <div className={styles.tags}>
          {item.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
