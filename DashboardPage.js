import React from 'react';
import { useAuth } from '../context/AuthContext';

const SEASON_STATS = [
  { icon: '🏆', label: 'Season Record', value: '—' },
  { icon: '⬡', label: 'Points / Game', value: '—' },
  { icon: '◎', label: 'Rebounds / Game', value: '—' },
  { icon: '⟳', label: 'Assists / Game', value: '—' },
];

const UPCOMING = [
  { date: 'TBD', opponent: 'Upcoming Schedule', location: 'TBD', home: true },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Hawk';

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          {greeting}, <span>{firstName}</span>
        </div>
        <div className="page-subtitle">Leo Hayes Varsity Girls Basketball · Team Portal</div>
      </div>

      {/* Season Stats */}
      <div className="stats-grid">
        {SEASON_STATS.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming Games */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div className="card-title">◈ Upcoming Schedule</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Location</th>
                <th>Home / Away</th>
              </tr>
            </thead>
            <tbody>
              {UPCOMING.map((g, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{g.date}</td>
                  <td>{g.opponent}</td>
                  <td className="text-muted">{g.location}</td>
                  <td>
                    <span className={`badge ${g.home ? 'badge-green' : 'badge-muted'}`}>
                      {g.home ? '⌂ Home' : '⟵ Away'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">⬟ Portal Info</div>
        </div>
        <p className="text-muted text-sm">
          Welcome to the Leo Hayes Varsity Girls Basketball team portal. This platform is your hub for team schedules, 
          communications, and resources. Content will be added here as the season progresses.
          {user?.role === 'admin' && (
            <><br /><br /><strong className="text-gold">You have admin access.</strong> Use the User Management section to add or remove team members.</>
          )}
        </p>
      </div>
    </div>
  );
}
