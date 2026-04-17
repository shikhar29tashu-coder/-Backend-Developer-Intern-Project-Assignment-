import { useState } from 'react';
import { register } from '../api';

const Register = ({ onAuth }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    try {
      const response = await register(form);
      onAuth(response.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Register</h2>
      {message ? <div className="alert">{message}</div> : null}
      <label>Name</label>
      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <label>Email</label>
      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <label>Password</label>
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
      <button type="submit">Create Account</button>
    </form>
  );
};

export default Register;
