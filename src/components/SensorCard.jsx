export default function SensorCard({ icon: Icon, title, value, unit, status, statusColor, accent, sub }) {
  return (
    <div className="glass card-hover fade-in" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{Icon && <Icon size={20} color="var(--text-0)" />}</div>
          <div><div style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</div>{sub && <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</div>}</div>
        </div>
        {status && <span className={`badge badge-${statusColor || 'neutral'}`}><span className={`dot dot-${statusColor || 'gray'}`} />{status}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="mono" style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>{value ?? '--'}</span>
        {unit && <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{unit}</span>}
      </div>
    </div>
  );
}
