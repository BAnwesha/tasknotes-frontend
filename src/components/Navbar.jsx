import { useAuth } from '../store/authStore.jsx';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ darkMode, onToggleDark }) {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <span className={styles.logo}>TaskNotes</span>
      <div className={styles.right}>
        <span className={styles.username}>👋 {user?.username}</span>
        <button
          className={styles.iconBtn}
          onClick={onToggleDark}
          title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}