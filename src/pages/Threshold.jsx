import { useEffect, useState } from 'react';
import { Save, CheckCircle2, XCircle, Gauge, Zap } from 'lucide-react';
import { updateValue } from '../services/firebase';

const THRESHOLD_FIELDS = [
  { key: 'NH3Threshold', label: 'NH3 Threshold', unit: 'ppm', color: '#06b6d4', icon: Gauge },
  { key: 'NOxThreshold', label: 'NOx Threshold', unit: 'ppm', color: '#f59e0b', icon: Gauge },
  { key: 'AlcoholThreshold', label: 'Alcohol Threshold', unit: 'ppm', color: '#a855f7', icon: Gauge },
  { key: 'BenzeneThreshold', label: 'Benzene Threshold', unit: 'ppm', color: '#ec4899', icon: Gauge },
  { key: 'SmokeThreshold', label: 'Smoke Threshold', unit: 'ppm', color: '#64748b', icon: Gauge },
  { key: 'CO2Threshold', label: 'CO2 Threshold', unit: 'ppm', color: '#ef4444', icon: Gauge },
];

export default function Threshold({ settings }) {
  const [values, setValues] = useState({});
  const [status, setStatus] = useState({});
  const [globalStatus, setGlobalStatus] = useState(null);

  useEffect(() => {
    const next = {};
    THRESHOLD_FIELDS.forEach((f) => {
      next[f.key] = settings?.[f.key] ?? '';
    });
    setValues(next);
  }, [settings]);

  const handleChange = (key, v) => setValues((p) => ({ ...p, [key]: v }));

  const handleSaveAll = async () => {
    let hasError = false;
    const nextStatus = {};
    const updates = {};
    THRESHOLD_FIELDS.forEach((f) => {
      const v = values[f.key];
      if (v === '' || v === null || v === undefined || isNaN(Number(v)) || Number(v) < 0 || !Number.isInteger(Number(v))) {
        nextStatus[f.key] = { type: 'error', msg: 'Only positive integers allowed' };
        hasError = true;
      } else {
        updates[f.key] = Number(v);
      }
    });

    if (hasError) {
      setStatus(nextStatus);
      setGlobalStatus({ type: 'error', msg: 'Please correct the errors' });
      setTimeout(() => setGlobalStatus(null), 3000);
      return;
    }

    setGlobalStatus({ type: 'saving', msg: 'Saving changes...' });
    try {
      await updateValue('SmartHome/Settings', updates);
      setGlobalStatus({ type: 'success', msg: 'Settings saved' });
      setStatus({});
      setTimeout(() => setGlobalStatus(null), 3000);
    } catch (e) {
      setGlobalStatus({ type: 'error', msg: 'Failed to save settings' });
      setTimeout(() => setGlobalStatus(null), 3000);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title">Threshold Settings</div>
          <div className="page-sub">Configure gas and current safety thresholds · updates Firebase in real time</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {globalStatus && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: globalStatus.type === 'success' ? 'var(--success)' : globalStatus.type === 'saving' ? 'var(--text-2)' : 'var(--danger)' }}>
              {globalStatus.type === 'success' && <CheckCircle2 size={15} />}
              {globalStatus.type === 'error' && <XCircle size={15} />}
              {globalStatus.msg}
            </div>
          )}
          <button className="btn btn-primary" onClick={handleSaveAll} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Save size={16} /> Save All Changes
          </button>
        </div>
      </div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {THRESHOLD_FIELDS.map((f) => {
          const st = status[f.key];
          return (
            <div key={f.key} className="glass card-hover" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bg-3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <f.icon size={20} color="var(--text-0)" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Current: <span className="mono" style={{ color: 'var(--text-1)', fontWeight: 600 }}>{settings?.[f.key] ?? '--'} {f.unit}</span></div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" type="number" min="0" step="1" placeholder="Enter threshold" value={values[f.key] ?? ''} onChange={(e) => handleChange(f.key, e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSaveAll(); }} />
              </div>
              {st && <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: st.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>{st.type === 'success' ? <CheckCircle2 size={14} /> : <XCircle size={14} />}{st.msg}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
