import { AlertTriangle, ShieldCheck, Bell } from 'lucide-react';

export default function AlertCard({ status, message, count }) {
  const active = status === true || status === 'true' || status === 'Active';
  return (
    <div className="glass card-hover fade-in" style={{ padding: 18, border: active ? '1px solid var(--danger)' : '1px solid var(--border)', background: active ? 'linear-gradient(180deg, rgba(239,68,68,0.12), rgba(21,29,51,0.55))' : undefined }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: active ? 'var(--danger-soft)' : 'var(--secondary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{active ? <AlertTriangle size={22} color="var(--danger)" /> : <ShieldCheck size={22} color="var(--success)" />}</div>
          <div><div style={{ fontWeight: 700, fontSize: 15 }}>Alert Status</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>{active ? 'Active alert' : 'System normal'}</div></div>
        </div>
        <span className={`badge badge-${active ? 'danger' : 'success'}`}><span className={`dot dot-${active ? 'red' : 'green'} ${active ? 'pulse-dot' : ''}`} />{active ? 'ACTIVE' : 'NORMAL'}</span>
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Message</div><div style={{ fontSize: 13, marginTop: 4, color: active ? 'var(--danger)' : 'var(--text-1)' }}>{message || 'No alerts'}</div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' }}><Bell size={14} color="var(--warning)" /><span style={{ fontSize: 12, color: 'var(--text-2)' }}>Alert Count</span><span className="mono" style={{ marginLeft: 'auto', fontWeight: 700, fontSize: 18, color: 'var(--warning)' }}>{count ?? 0}</span></div>
      </div>
    </div>
  );
}
