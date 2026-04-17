import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [view, setView] = useState('login');

  const handleLogin = ({ token: authToken, user: userData }) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken('');
    setUser(null);
    setView('login');
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Task Manager</h1>
        {user ? (
          <div className="header-meta">
            <span>{user.name} ({user.role})</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : null}
      </header>

      {!token ? (
        <div className="auth-panel">
          <div className="tabs">
            <button onClick={() => setView('login')} className={view === 'login' ? 'active' : ''}>Login</button>
            <button onClick={() => setView('register')} className={view === 'register' ? 'active' : ''}>Register</button>
          </div>
          {view === 'login' ? <Login onAuth={handleLogin} /> : <Register onAuth={handleLogin} />}
        </div>
      ) : (
        <Dashboard token={token} user={user} />
      )}
    </div>
  );
};

export default App;
