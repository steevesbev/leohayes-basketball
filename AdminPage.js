import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function UserModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'member',
    active: user?.active !== undefined ? Boolean(user.active) : true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { name: form.name, role: form.role, active: form.active };
      if (!user) { payload.email = form.email; payload.password = form.password; }
      else if (form.password) { payload.password = form.password; }
      if (!user) {
        await axios.post('/api/admin/users', payload);
      } else {
        await axios.patch(`/api/admin/users/${user.id}`, payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{user ? 'Edit User' : 'Add User'}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {error && <div className="alert alert-error">⚠ {error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" name="name" value={form.name}
              onChange={handle} placeholder="Player or staff name" required />
          </div>
          {!user && (
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" name="email" type="email" value={form.email}
                onChange={handle} placeholder="email@example.com" required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">{user ? 'New Password (leave blank to keep)' : 'Password'}</label>
            <input className="form-input" name="password" type="password" value={form.password}
              onChange={handle} placeholder="Min. 8 characters" required={!user} />
          </div>
          <div className="row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" name="role" value={form.role} onChange={handle}>
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            {user && (
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-select" name="active"
                  value={form.active ? '1' : '0'}
                  onChange={e => setForm(f => ({ ...f, active: e.target.value === '1' }))}>
                  <option value="1">Active</option>
                  <option value="0">Disabled</option>
                </select>
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⟳ Saving…' : (user ? '→ Save Changes' : '+ Add User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | user object
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, statsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/stats'),
      ]);
      setUsers(usersRes.data);
      setStats(statsRes.data);
    } catch { setError('Failed to load users'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteUser = async (u) => {
    if (!window.confirm(`Remove ${u.name} from the portal?`)) return;
    try {
      await axios.delete(`/api/admin/users/${u.id}`);
      load();
    } catch (err) { setError(err.response?.data?.error || 'Delete failed'); }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="flex-between">
          <div>
            <div className="page-title">User <span>Management</span></div>
            <div className="page-subtitle">Add, edit, and remove team portal accounts</div>
          </div>
          <button className="btn btn-primary" onClick={() => setModal('add')}>
            + Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 24 }}>
          <div className="stat-card">
            <div className="stat-icon">◉</div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Accounts</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⬡</div>
            <div className="stat-value">{stats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⬟</div>
            <div className="stat-value">{stats.admins}</div>
            <div className="stat-label">Administrators</div>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">⚠ {error}</div>}

      <div className="card">
        <div className="card-header">
          <div className="card-title">⬟ All Accounts</div>
          <input
            className="form-input"
            style={{ width: 220, marginBottom: 0 }}
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-muted" style={{ padding: '24px 0', textAlign: 'center' }}>Loading…</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--hawk-slate)',
                          border: u.id === me?.id ? '2px solid var(--hawk-gold)' : '2px solid transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8rem',
                          color: 'var(--hawk-gold)', flexShrink: 0
                        }}>
                          {u.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{u.name}{u.id === me?.id && <span className="text-gold"> (you)</span>}</span>
                      </div>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-muted'}`}>
                        {u.role === 'admin' ? '⬟ Admin' : '◎ Member'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>
                        {u.active ? '● Active' : '○ Disabled'}
                      </span>
                    </td>
                    <td className="text-muted text-sm">
                      {u.last_login ? new Date(u.last_login + 'Z').toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Never'}
                    </td>
                    <td>
                      <div className="action-group">
                        <button className="btn btn-ghost btn-sm" onClick={() => setModal(u)}>Edit</button>
                        {u.id !== me?.id && (
                          <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u)}>Remove</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'rgba(240,239,232,0.3)' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <UserModal
          user={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}
