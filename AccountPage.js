import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '?';

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (newPassword !== confirmPassword) { setError('New passwords do not match'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/change-password', { currentPassword, newPassword });
      setSuccess('Password updated successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-title">My <span>Account</span></div>
        <div className="page-subtitle">Manage your profile and security settings</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Profile card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">◉ Profile</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--hawk-slate)',
              border: '3px solid var(--hawk-gold)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem',
              color: 'var(--hawk-gold)'
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>{user?.name}</div>
              <div className="text-muted text-sm">{user?.email}</div>
              <span className={`badge mt-8 ${user?.role === 'admin' ? 'badge-gold' : 'badge-green'}`}>
                {user?.role === 'admin' ? '⬟ Admin' : '◎ Member'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { label: 'Full Name', value: user?.name },
              { label: 'Email Address', value: user?.email },
              { label: 'Account Role', value: user?.role === 'admin' ? 'Administrator' : 'Team Member' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                padding: '12px 14px',
                background: 'var(--hawk-slate)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                <div className="form-label" style={{ marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: '0.95rem' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Change password */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">⬡ Change Password</div>
          </div>
          {error && <div className="alert alert-error">⚠ {error}</div>}
          {success && <div className="alert alert-success">✓ {success}</div>}
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" placeholder="Current password"
                value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input className="form-input" type="password" placeholder="Min. 8 characters"
                value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input className="form-input" type="password" placeholder="Repeat new password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? '⟳ Updating…' : '→ Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
