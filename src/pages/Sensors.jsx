import { Thermometer, Droplets, Wind, Footprints, Clock, Activity } from 'lucide-react';
import DownloadBar from '../components/DownloadBar';
import { GAS_TYPES } from '../hooks/useFirebase';

function BigCard({ icon: Icon, title, value, unit, status, color, lastUpdated }) {
  return (
    <div className="glass card-hover fade-in" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={26} color={color} /></div><div><div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div><div style={{ fontSize: 12, color: 'var(--text-2)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}><Clock size={12} /> {lastUpdated || '—'}</div></div></div>
        <span className={`badge badge-${status.color}`}>{status.text}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}><span className="mono" style={{ fontSize: 42, fontWeight: 700, letterSpacing: '-0.03em', color }}>{value ?? '--'}</span>{unit && <span style={{ fontSize: 18, color: 'var(--text-2)' }}>{unit}</span>}</div>
    </div>
  );
}

export default function Sensors({ data, loading, history, onClearHistory }) {
  const s = data.Sensors || {};
  const motionDetected = s.Motion === true || s.Motion === 'true' || s.Motion === 1 || s.Motion === 'Detected';
  const lastUpdated = new Date().toLocaleTimeString(undefined, { hour12: false });
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}><div><div className="page-title">Sensors</div><div className="page-sub">All sensor readings update automatically from Firebase</div></div><DownloadBar history={history} onClear={onClearHistory} filename="sensor-readings.csv" /></div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <BigCard icon={Thermometer} title="Temperature" value={s.Temperature} unit="°C" status={{ text: 'Live', color: 'success' }} color="#3b82f6" lastUpdated={lastUpdated} />
        <BigCard icon={Droplets} title="Humidity" value={s.Humidity} unit="%" status={{ text: 'Live', color: 'success' }} color="#06b6d4" lastUpdated={lastUpdated} />
        <BigCard icon={Wind} title="Gas (Raw)" value={s.Gas} unit="ppm" status={{ text: 'Live', color: 'success' }} color="#ef4444" lastUpdated={lastUpdated} />
        <BigCard icon={Footprints} title="Motion" value={motionDetected ? 'Detected' : 'No Motion'} status={{ text: motionDetected ? 'Detected' : 'Clear', color: motionDetected ? 'warning' : 'neutral' }} color="#f59e0b" lastUpdated={lastUpdated} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><Activity size={16} color="var(--primary)" /><span style={{ fontWeight: 700, fontSize: 15 }}>MQ Sensor — Detected Gases</span></div>
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {GAS_TYPES.filter((g) => g.key !== 'Gas').map((g) => (<BigCard key={g.key} icon={Wind} title={g.label} value={s[g.key]} unit={g.unit} status={{ text: 'Live', color: 'success' }} color={g.color} lastUpdated={lastUpdated} />))}
        </div>
      </div>
    </div>
  );
}
