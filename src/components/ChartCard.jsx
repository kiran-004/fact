import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ChartCard({ title, data, dataKey, color, unit, icon: Icon, last = 50 }) {
  const points = (data || []).slice(-last).map((d, i) => ({ i, label: new Date(d.t).toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), value: typeof d[dataKey] === 'number' ? d[dataKey] : Number(d[dataKey]) || 0 }));
  return (
    <div className="glass fade-in" style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{Icon && <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={16} color="var(--text-0)" /></div>}<div><div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div><div style={{ fontSize: 11, color: 'var(--text-3)' }}>Last {Math.min(last, points.length)} readings</div></div></div>
        {points.length > 0 && <span className="mono" style={{ fontSize: 13, fontWeight: 600, color }}>{points[points.length - 1].value} {unit}</span>}
      </div>
      <div style={{ height: 180 }}>
        {points.length === 0 ? (<div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)', fontSize: 13 }}>Waiting for data…</div>) : (<ResponsiveContainer width="100%" height="100%"><AreaChart data={points} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}><defs><linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.4} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="rgba(99,132,255,0.08)" /><XAxis dataKey="label" tick={{ fill: 'var(--text-3)', fontSize: 10 }} stroke="rgba(99,132,255,0.1)" minTickGap={40} /><YAxis tick={{ fill: 'var(--text-3)', fontSize: 10 }} stroke="rgba(99,132,255,0.1)" width={48} /><Tooltip contentStyle={{ background: 'var(--bg-2)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 12, color: 'var(--text-0)' }} labelStyle={{ color: 'var(--text-2)' }} formatter={(v) => [`${v} ${unit}`, title]} /><Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} dot={false} animationDuration={300} /></AreaChart></ResponsiveContainer>)}
      </div>
    </div>
  );
}
