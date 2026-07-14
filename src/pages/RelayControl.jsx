import { useState } from 'react';
import { ToggleRight, Zap } from 'lucide-react';
import RelayCard from '../components/RelayCard';
import { writeValue } from '../services/firebase';

export default function RelayControl({ data }) {
  const r1 = data.Relay1 || {};
  const r2 = data.Relay2 || {};
  const [busy, setBusy] = useState(false);
  const handleToggle = async () => { const current = r2.Command === 'ON' || r2.Command === true; setBusy(true); try { await writeValue('Relay2/Command', current ? 'OFF' : 'ON'); } catch (e) { console.error(e); } setBusy(false); };
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div><div className="page-title">Relay Control</div><div className="page-sub">Relay 1 is display-only (ESP32 controlled) · Relay 2 can be toggled</div></div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <RelayCard title="Relay 1" status={r1.Status} readOnly icon={Zap} />
        <RelayCard title="Relay 2" status={r2.Status} command={r2.Command} onToggle={handleToggle} icon={ToggleRight} />
      </div>
      {busy && <div style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 13 }}>Sending command to Firebase…</div>}
    </div>
  );
}
