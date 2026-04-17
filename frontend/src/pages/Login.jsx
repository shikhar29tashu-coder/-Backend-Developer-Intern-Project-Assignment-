import { useState } from 'react';
import { login } from '../api';

const Login = ({ onAuth }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    try {
      const response = await login(form);
      onAuth(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      {message ? <div className="alert">{message}</div> : null}
      <label>Email</label>
      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <label>Password</label>
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Login;
