import { useEffect, useState } from 'react';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';

export default function Navbar({ onToggleSidebar, dark, setDark }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const dateStr = now.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString(undefined, { hour12: false });
  return (
    <header className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onToggleSidebar} className="btn-ghost btn" style={{ padding: 8 }}><Menu size={18} /></button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.01em' }}>Factory Monitoring System</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-2)' }}>{dateStr} · {timeStr}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={() => setDark(!dark)} className="btn-ghost btn" style={{ padding: 8 }} title="Toggle theme">{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        <button className="btn-ghost btn" style={{ padding: 8, position: 'relative' }} title="Notifications"><Bell size={18} /><span className="pulse-dot" style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: 'var(--danger)' }} /></button>
        <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px 6px 6px', borderRadius: 999 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><User size={16} /></div>
          <span style={{ fontSize: 13, fontWeight: 600 }}>Operator</span>
        </div>
      </div>
    </header>
  );
}
