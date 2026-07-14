import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gauge, SlidersHorizontal, Bell, ToggleRight, Activity, FileText } from 'lucide-react';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/sensors', label: 'Sensors', icon: Gauge },
  { to: '/threshold', label: 'Threshold Settings', icon: SlidersHorizontal },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/relay', label: 'Relay Control', icon: ToggleRight },
  { to: '/system', label: 'System Status', icon: Activity },
  { to: '/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 40 }} />}
      <aside className="glass" style={{ width: 248, flexShrink: 0, padding: '16px 12px', borderRight: '1px solid var(--border)', borderTop: 'none', borderBottom: 'none', borderLeft: 'none', borderRadius: 0, position: 'fixed', left: 0, top: 64, bottom: 0, transform: open ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)', zIndex: 50, overflowY: 'auto' }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} onClick={onClose} style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--radius-sm)', fontSize: 14, fontWeight: 600, color: isActive ? 'var(--text-0)' : 'var(--text-2)', background: isActive ? 'var(--primary-soft)' : 'transparent', border: isActive ? '1px solid var(--border-strong)' : '1px solid transparent', transition: 'all 0.2s' })}>
              {({ isActive }) => (<><Icon size={18} color={isActive ? 'var(--primary)' : undefined} />{label}</>)}
            </NavLink>
          ))}
        </nav>
        <div style={{ marginTop: 24, padding: '0 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>ESP32-S3 · Live</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase RTDB</div>
        </div>
      </aside>
    </>
  );
}
