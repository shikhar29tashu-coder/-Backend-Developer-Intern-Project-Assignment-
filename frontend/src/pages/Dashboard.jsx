import { useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../api';

const Dashboard = ({ token, user }) => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });
  const [message, setMessage] = useState(null);

  const loadTasks = async () => {
    try {
      const response = await getTasks(token);
      setTasks(response.data.tasks || []);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Cannot load tasks');
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
      await createTask(token, form);
      setForm({ title: '', description: '', status: 'pending' });
      await loadTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Create failed');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(token, id);
      await loadTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Delete failed');
    }
  };

  const toggleStatus = async (task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTask(token, task._id, { status: nextStatus });
      await loadTasks();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="dashboard">
      <section className="card">
        <h2>Welcome, {user.name}</h2>
        <p>Role: {user.role}</p>
        {message ? <div className="alert">{message}</div> : null}
      </section>

      <section className="card task-form">
        <h3>Create Task</h3>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      </section>

      <section className="card task-list">
        <h3>My Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <article key={task._id} className="task-item">
                <div>
                  <strong>{task.title}</strong>
                  <p>{task.description || 'No description'}</p>
                  <small>Status: {task.status}</small>
                </div>
                <div className="task-actions">
                  <button onClick={() => toggleStatus(task)}>{task.status === 'completed' ? 'Mark Pending' : 'Mark Done'}</button>
                  <button className="danger" onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
