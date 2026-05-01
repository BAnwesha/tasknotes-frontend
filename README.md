# TaskNotes Frontend

A React single-page application for managing tasks and notes, with drag-and-drop reordering, tag filtering, full-text search, and dark mode.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build Tool | Vite |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Drag and Drop | @hello-pangea/dnd |
| Styling | CSS Modules |
| State | React Context + useState |

## Features

- JWT authentication with protected and public routes
- Create, edit, delete tasks and notes
- Tab-based view — switch between tasks and notes
- Priority badges (HIGH / MEDIUM / LOW) with color coding
- Due date tracking with overdue detection
- Tag filtering via chip buttons
- Real-time client-side search
- Drag-and-drop reordering (persisted to backend)
- Dark mode with CSS variable theming
- Completion toggle with strikethrough animation
- Stats bar showing task count and completion rate

## Project Structure
src/
├── api/
│   ├── axiosClient.js      # Axios instance with request/response interceptors
│   ├── auth.api.js         # Login, register
│   └── items.api.js        # Full CRUD + reorder
├── components/
│   ├── Navbar.jsx          # Logo, dark mode toggle, logout
│   ├── ItemCard.jsx        # Task/note card with priority border
│   └── ItemModal.jsx       # Create/edit modal form
├── hooks/
│   └── useItems.js         # Data fetching and state management
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── DashboardPage.jsx   # Main view with tabs, search, drag-drop
├── store/
│   └── authStore.jsx       # Auth context — user, token, login, logout
└── styles/
└── theme.css           # CSS variables for light and dark mode

## Getting Started

### Prerequisites

- Node.js 18+
- TaskNotes API running on `http://localhost:8080`

### Install and run

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173`

### Build for production

```bash
npm run build
```

## Auth Flow
User submits login form
→ POST /api/auth/login
→ Token stored in localStorage
→ Axios interceptor attaches token to all future requests
→ ProtectedRoute allows access to dashboard
→ On 401 response, interceptor clears token and redirects to login

## Key Design Decisions

**Single Axios instance with interceptors** — the request interceptor automatically attaches the JWT Bearer token to every outgoing request. The response interceptor globally handles 401 errors by clearing the session and redirecting to login — no component needs to handle token expiry manually.

**Client-side filtering** — search and tag filtering happen entirely in the browser using `useMemo`. This avoids unnecessary API calls for every keystroke and keeps the UI instant. The full item list is fetched once on mount.

**Optimistic state updates** — after create, update, delete, and toggle operations, the local state is updated immediately using the server's response rather than re-fetching the full list. This makes every action feel instant.

**CSS variables for dark mode** — all colors are defined as CSS custom properties on `:root` and overridden under `[data-theme='dark']`. Toggling dark mode sets a single attribute on `<html>` and the entire app repaints with no JavaScript color logic.

**`useItems` custom hook** — all item state, fetching, and mutations live in one hook. Dashboard stays clean and only calls the hook to get data and action functions. If items were needed elsewhere, the same hook could be reused without duplication.

## Environment

The API base URL is set in `axiosClient.js`:

```javascript
baseURL: 'http://localhost:8080/api'
```

For production, replace this with your deployed API URL or use a `.env` file:
VITE_API_URL=https://your-api.com/api

Then update `axiosClient.js`:
```javascript
baseURL: import.meta.env.VITE_API_URL
```
