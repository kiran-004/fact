import { Thermometer, Droplets, Wind, Footprints, ToggleRight, ToggleLeft, AlertTriangle, Gauge, Activity } from 'lucide-react';
import SensorCard from '../components/SensorCard';
import AlertCard from '../components/AlertCard';
import ChartCard from '../components/ChartCard';
import { GAS_TYPES } from '../hooks/useFirebase';

export default function Dashboard({ data, loading, history, alerts }) {
  const s = data.Sensors || {};
  const r1 = data.Relay1 || {};
  const r2 = data.Relay2 || {};
  const al = data.Alert || {};
  const settings = data.Settings || {};
  const motionDetected = s.Motion === true || s.Motion === 'true' || s.Motion === 1 || s.Motion === 'Detected';
  const relay1On = r1.Status === 'ON' || r1.Status === true || r1.Status === 1;
  const relay2On = r2.Status === 'ON' || r2.Status === true || r2.Status === 1;
  const alertActive = al.Status === true || al.Status === 'true' || al.Status === 'Active';
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><div className="page-title">Dashboard Overview</div><div className="page-sub">Real-time factory sensor monitoring · ESP32-S3 · Firebase RTDB</div></div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
        <SensorCard icon={Thermometer} title="Temperature" value={s.Temperature} unit="°C" status={s.Temperature != null ? 'Normal' : 'N/A'} statusColor="blue" accent="rgba(59,130,246,0.2)" />
        <SensorCard icon={Droplets} title="Humidity" value={s.Humidity} unit="%" status={s.Humidity != null ? 'Normal' : 'N/A'} statusColor="blue" accent="rgba(6,182,212,0.2)" />
        <SensorCard icon={Footprints} title="Motion" value={motionDetected ? 'Detected' : 'No Motion'} status={motionDetected ? 'Detected' : 'Clear'} statusColor={motionDetected ? 'warning' : 'neutral'} accent="rgba(245,158,11,0.2)" />
        <SensorCard icon={ToggleRight} title="Relay 1" value={relay1On ? 'ON' : 'OFF'} status={relay1On ? 'ON' : 'OFF'} statusColor={relay1On ? 'success' : 'neutral'} accent="rgba(16,185,129,0.2)" />
        <SensorCard icon={ToggleLeft} title="Relay 2" value={relay2On ? 'ON' : 'OFF'} status={relay2On ? 'ON' : 'OFF'} statusColor={relay2On ? 'success' : 'neutral'} accent="rgba(16,185,129,0.2)" />
        <AlertCard status={al.Status} message={al.Message} count={alerts.length} />
      </div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <ChartCard title="Temperature" data={history} dataKey="Temperature" color="#3b82f6" unit="°C" icon={Thermometer} />
        <ChartCard title="Humidity" data={history} dataKey="Humidity" color="#06b6d4" unit="%" icon={Droplets} />
      </div>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><Activity size={16} color="var(--primary)" /><span style={{ fontWeight: 700, fontSize: 15 }}>Gas Sensor Breakdown</span><span style={{ fontSize: 12, color: 'var(--text-3)' }}>· MQ sensor detected gases</span></div>
        <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          {GAS_TYPES.map((g) => (<ChartCard key={g.key} title={g.label} data={history} dataKey={g.key} color={g.color} unit={g.unit} icon={Wind} />))}
        </div>
      </div>
    </div>
  );
}
