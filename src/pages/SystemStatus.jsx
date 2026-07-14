import { useEffect, useState } from 'react';
import { Cpu, Database, Activity, Wifi, Clock, CheckCircle2, XCircle } from 'lucide-react';
import DownloadBar from '../components/DownloadBar';
import { formatTime } from '../utils/csv';

function StatusRow({ icon: Icon, label, ok, detail }) {
  return (<div className="glass card-hover" style={{ padding: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', alignItems: 'center', gap: 14 }}><div style={{ width: 44, height: 44, borderRadius: 12, background: ok ? 'var(--secondary-soft)' : 'var(--danger-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={22} color={ok ? 'var(--success)' : 'var(--danger)'} /></div><div><div style={{ fontWeight: 700, fontSize: 14 }}>{label}</div><div style={{ fontSize: 12, color: 'var(--text-2)' }}>{detail}</div></div></div>{ok ? <CheckCircle2 size={22} color="var(--success)" /> : <XCircle size={22} color="var(--danger)" />}</div>);
}

export default function SystemStatus({ data, loading, history, onClearHistory }) {
  const s = data.Sensors || {};
  const r1 = data.Relay1 || {};
  const r2 = data.Relay2 || {};
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  useEffect(() => { if (!loading) setLastUpdate(Date.now()); }, [data, loading]);
  const espConnected = !loading && (s.Temperature != null || s.Gas != null || s.Humidity != null);
  const firebaseConnected = !loading;
  const sensorHealth = espConnected && s.Temperature != null && s.Gas != null;
  const relayOk = r1.Status != null || r2.Status != null;
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}><div><div className="page-title">System Status</div><div className="page-sub">ESP32-S3 connection and sensor health monitoring</div></div><DownloadBar history={history} onClear={onClearHistory} filename="system-history.csv" /></div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <StatusRow icon={Cpu} label="ESP32 Connection" ok={espConnected} detail={espConnected ? 'Controller online' : 'Waiting for data…'} />
        <StatusRow icon={Database} label="Firebase Connection" ok={firebaseConnected} detail={firebaseConnected ? 'Realtime DB connected' : 'Connecting…'} />
        <StatusRow icon={Activity} label="Sensor Health" ok={sensorHealth} detail={sensorHealth ? 'All sensors reporting' : 'Some sensors offline'} />
        <StatusRow icon={Wifi} label="Relay Status" ok={relayOk} detail={`R1: ${r1.Status ?? '--'} · R2: ${r2.Status ?? '--'}`} />
        <StatusRow icon={Clock} label="Last Update" ok={!loading} detail={formatTime(lastUpdate)} />
      </div>
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Sensor Snapshot</div>
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {[['Temperature', s.Temperature, '°C'], ['Humidity', s.Humidity, '%'], ['Gas', s.Gas, 'ppm'], ['NH3', s.NH3, 'ppm'], ['NOx', s.NOx, 'ppm'], ['Alcohol', s.Alcohol, 'ppm'], ['Benzene', s.Benzene, 'ppm'], ['Smoke', s.Smoke, 'ppm'], ['CO2', s.CO2, 'ppm'], ['Motion', s.Motion === true || s.Motion === 'true' ? 'Detected' : 'No Motion', '']].map(([label, val, unit]) => (<div key={label} style={{ padding: 14, background: 'var(--bg-1)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}><div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div><div className="mono" style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{val ?? '--'} <span style={{ fontSize: 12, color: 'var(--text-2)' }}>{unit}</span></div></div>))}
        </div>
      </div>
    </div>
  );
}
