import { AlertTriangle, ShieldCheck, Trash2, Bell } from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { formatTime } from '../utils/csv';

export default function Alerts({ data, alerts, onClear }) {
  const al = data.Alert || {};
  const s = data.Sensors || {};
  const alertActive = al.Status === true || al.Status === 'true' || al.Status === 'Active';
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><div className="page-title">Alerts</div><div className="page-sub">Current alert status and alert history</div></div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <AlertCard status={al.Status} message={al.Message} count={alerts.length} />
        <div className="glass" style={{ padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}><Bell size={18} color="var(--warning)" /><span style={{ fontWeight: 700, fontSize: 14 }}>Current Alert State</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Row label="Status" value={alertActive ? 'ACTIVE' : 'NORMAL'} color={alertActive ? 'var(--danger)' : 'var(--success)'} />
            <Row label="Message" value={al.Message || 'No alerts'} />
            <Row label="Motion" value={s.Motion === true || s.Motion === 'true' ? 'Detected' : 'No Motion'} />
          </div>
        </div>
      </div>
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><AlertTriangle size={18} color="var(--warning)" /><span style={{ fontWeight: 700, fontSize: 15 }}>Recent Alerts</span><span className="badge badge-neutral">{alerts.length}</span></div>
          <button className="btn btn-ghost" onClick={onClear} disabled={!alerts.length}><Trash2 size={16} /> Clear History</button>
        </div>
        {alerts.length === 0 ? (<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-3)' }}><ShieldCheck size={40} style={{ marginBottom: 10 }} /><div>No alerts recorded</div></div>) : (<div style={{ overflowX: 'auto' }}><table className="data-table"><thead><tr><th>Time</th><th>Motion</th><th>Message</th><th>Status</th></tr></thead><tbody>{[...alerts].reverse().map((a, i) => (<tr key={i}><td className="mono">{formatTime(a.time)}</td><td>{a.motion === true || a.motion === 'true' ? 'Detected' : 'No Motion'}</td><td>{a.message}</td><td><span className="badge badge-danger"><span className="dot dot-red" /> {a.status}</span></td></tr>))}</tbody></table></div>)}
      </div>
    </div>
  );
}

function Row({ label, value, color }) {
  return (<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}><span style={{ fontSize: 12, color: 'var(--text-2)' }}>{label}</span><span className="mono" style={{ fontSize: 13, fontWeight: 600, color: color || 'var(--text-0)' }}>{value}</span></div>);
}
