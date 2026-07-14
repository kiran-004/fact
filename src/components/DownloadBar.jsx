import { Download, Trash2 } from 'lucide-react';
import { downloadCSV, formatTime } from '../utils/csv';

export default function DownloadBar({ history, onClear, filename = 'sensor-history.csv' }) {
  const handleDownload = () => {
    const rows = history.map((d) => ({ Timestamp: formatTime(d.t), Temperature: d.Temperature, Humidity: d.Humidity, Gas: d.Gas, NH3: d.NH3, NOx: d.NOx, Alcohol: d.Alcohol, Motion: d.Motion, Benzene: d.Benzene, Smoke: d.Smoke, CO2: d.CO2, Relay1_Status: d.Relay1_Status, Relay2_Command: d.Relay2_Command, Relay2_Status: d.Relay2_Status, Alert_Status: d.Alert_Status, Alert_Message: d.Alert_Message }));
    downloadCSV(filename, rows, Object.keys(rows[0] || { Timestamp: '' }));
  };
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
      <button className="btn btn-primary" onClick={handleDownload} disabled={!history.length}><Download size={16} /> Download CSV ({history.length})</button>
      {onClear && <button className="btn btn-ghost" onClick={onClear} disabled={!history.length}><Trash2 size={16} /> Clear</button>}
    </div>
  );
}
