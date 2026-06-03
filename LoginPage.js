import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="login-art-content">
          <div className="login-hawk-emblem">🦅</div>
          <div className="login-art-title">Leo<br /><span>Hayes</span></div>
          <div className="login-art-sub">Varsity Girls Basketball</div>
          <div className="login-art-season">◈ Season 2025–2026</div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-box">
          <div className="login-welcome">
            Welcome<br /><span>Back</span>
          </div>
          <div className="login-hint">Sign in to access the team portal</div>

          {error && <div className="alert alert-error">⚠ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              className="btn btn-primary btn-full mt-8"
              type="submit"
              disabled={loading}
            >
              {loading ? '⟳  Signing In…' : '→  Sign In'}
            </button>
          </form>

          <hr className="login-divider" />
          <p className="text-muted text-sm" style={{ textAlign: 'center' }}>
            Don't have an account? Contact your team administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
