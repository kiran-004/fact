import { ToggleLeft, ToggleRight, Lock } from 'lucide-react';

export default function RelayCard({ title, status, command, onToggle, readOnly, icon: Icon }) {
  const isOn = readOnly ? status === 'ON' || status === true : command === 'ON' || command === true;
  return (
    <div className="glass card-hover fade-in" style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: isOn ? 'var(--secondary-soft)' : 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s' }}>{Icon ? <Icon size={22} color={isOn ? 'var(--success)' : 'var(--text-2)'} /> : null}</div>
          <div><div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>{readOnly ? 'Display only' : 'Toggle to control'}</div></div>
        </div>
        {readOnly && <Lock size={16} color="var(--text-3)" />}
      </div>
      <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</div><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}><span className={`dot dot-${isOn ? 'green' : 'red'}`} /><span className="mono" style={{ fontWeight: 700, fontSize: 16, color: isOn ? 'var(--success)' : 'var(--danger)' }}>{isOn ? 'ON' : 'OFF'}</span></div></div>
        {!readOnly && (<button onClick={onToggle} style={{ background: isOn ? 'var(--secondary-soft)' : 'var(--bg-3)', border: '1px solid', borderColor: isOn ? 'var(--success)' : 'var(--border)', borderRadius: 999, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8, color: isOn ? 'var(--success)' : 'var(--text-2)', fontWeight: 600, fontSize: 13, transition: 'all 0.2s' }}>{isOn ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}{isOn ? 'ON' : 'OFF'}</button>)}
      </div>
      {!readOnly && command !== undefined && command !== null && (<div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 12, color: 'var(--text-2)' }}>Current Command</span><span className="mono" style={{ fontSize: 12, fontWeight: 600, color: command === 'ON' ? 'var(--success)' : 'var(--text-1)' }}>{String(command)}</span></div>)}
    </div>
  );
}
