import { useState, useMemo } from 'react';
import { FileText, Calendar, Clock, Download, Search, CheckSquare, Square, Filter, X, ChevronDown } from 'lucide-react';
import { downloadCSV, formatTime } from '../utils/csv';

const ALL_SENSORS = [
  { key: 'Temperature', label: 'Temperature', unit: '°C', color: '#3b82f6' },
  { key: 'Humidity',    label: 'Humidity',    unit: '%',  color: '#06b6d4' },
  { key: 'Gas',         label: 'Gas (Raw)',   unit: 'ppm',color: '#ef4444' },
  { key: 'NH3',         label: 'NH3',         unit: 'ppm',color: '#06b6d4' },
  { key: 'NOx',         label: 'NOx',         unit: 'ppm',color: '#f59e0b' },
  { key: 'Alcohol',     label: 'Alcohol',     unit: 'ppm',color: '#a855f7' },
  { key: 'Benzene',     label: 'Benzene',     unit: 'ppm',color: '#ec4899' },
  { key: 'Smoke',       label: 'Smoke',       unit: 'ppm',color: '#64748b' },
  { key: 'CO2',         label: 'CO2',         unit: 'ppm',color: '#ef4444' },
  { key: 'Motion',      label: 'Motion',      unit: '',   color: '#f59e0b' },
  { key: 'Relay1_Status',  label: 'Relay 1 Status',  unit: '', color: '#22c55e' },
  { key: 'Relay2_Status',  label: 'Relay 2 Status',  unit: '', color: '#22c55e' },
  { key: 'Alert_Status',   label: 'Alert Status',     unit: '', color: '#ef4444' },
  { key: 'Alert_Message',  label: 'Alert Message',    unit: '', color: '#f59e0b' },
];

function toLocalDatetimeValue(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function Reports({ history }) {
  const data = history || [];

  // Sensor selection
  const [selected, setSelected] = useState(() => new Set(ALL_SENSORS.map((s) => s.key)));

  // Date-time range
  const minTs = data.length ? data[0].t : null;
  const maxTs = data.length ? data[data.length - 1].t : null;
  const [fromDt, setFromDt] = useState('');
  const [toDt,   setToDt]   = useState('');

  // Quick filter buttons
  const applyQuick = (minutes) => {
    const now = Date.now();
    setFromDt(toLocalDatetimeValue(now - minutes * 60 * 1000));
    setToDt(toLocalDatetimeValue(now));
  };

  const clearRange = () => { setFromDt(''); setToDt(''); };

  // Toggle helpers
  const toggleSensor = (key) =>
    setSelected((prev) => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  const toggleAll = () =>
    setSelected(selected.size === ALL_SENSORS.length ? new Set() : new Set(ALL_SENSORS.map((s) => s.key)));

  // Filtered rows
  const filtered = useMemo(() => {
    let rows = data;
    if (fromDt) rows = rows.filter((r) => r.t >= new Date(fromDt).getTime());
    if (toDt)   rows = rows.filter((r) => r.t <= new Date(toDt).getTime());
    return rows;
  }, [data, fromDt, toDt]);

  const activeSensors = ALL_SENSORS.filter((s) => selected.has(s.key));

  const handleDownload = () => {
    if (!filtered.length) return;
    const headers = ['Timestamp', 'Date', 'Time', 'Day', ...activeSensors.map((s) => `${s.label}${s.unit ? ' (' + s.unit + ')' : ''}`)];
    const rows = filtered.map((r) => {
      const d = new Date(r.t);
      const row = {
        Timestamp: r.t,
        Date: d.toLocaleDateString(),
        Time: d.toLocaleTimeString(undefined, { hour12: false }),
        Day: d.toLocaleDateString(undefined, { weekday: 'long' }),
      };
      activeSensors.forEach((s) => { row[`${s.label}${s.unit ? ' (' + s.unit + ')' : ''}`] = r[s.key] ?? ''; });
      return row;
    });
    downloadCSV(`sensor-report-${Date.now()}.csv`, rows, headers);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={22} color="var(--primary)" /> Reports
          </div>
          <div className="page-sub">Filter by date, time &amp; sensor · export to CSV</div>
        </div>
        <button className="btn btn-primary" onClick={handleDownload} disabled={!filtered.length || !activeSensors.length}>
          <Download size={16} /> Download CSV
        </button>
      </div>

      {/* ── Date / Time Filter ── */}
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Calendar size={16} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Date &amp; Time Range</span>
          {(fromDt || toDt) && (
            <button onClick={clearRange} className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11, marginLeft: 'auto' }}>
              <X size={13} /> Clear
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>From</label>
            <input type="datetime-local" className="input" value={fromDt} onChange={(e) => setFromDt(e.target.value)}
              min={minTs ? toLocalDatetimeValue(minTs) : undefined}
              max={toDt || (maxTs ? toLocalDatetimeValue(maxTs) : undefined)} />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: 6 }}>To</label>
            <input type="datetime-local" className="input" value={toDt} onChange={(e) => setToDt(e.target.value)}
              min={fromDt || (minTs ? toLocalDatetimeValue(minTs) : undefined)}
              max={maxTs ? toLocalDatetimeValue(maxTs) : undefined} />
          </div>
        </div>
        {/* Quick range buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
          {[['Last 15 min', 15], ['Last 1 hr', 60], ['Last 6 hrs', 360], ['Last 24 hrs', 1440], ['Last 7 days', 10080]].map(([label, mins]) => (
            <button key={label} onClick={() => applyQuick(mins)} className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12 }}>
              <Clock size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Sensor Checkboxes ── */}
      <div className="glass" style={{ padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Filter size={16} color="var(--primary)" />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Select Sensors</span>
          <button onClick={toggleAll} className="btn btn-ghost" style={{ padding: '4px 12px', fontSize: 11, marginLeft: 'auto' }}>
            {selected.size === ALL_SENSORS.length ? <CheckSquare size={13} /> : <Square size={13} />}
            {selected.size === ALL_SENSORS.length ? ' Deselect All' : ' Select All'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
          {ALL_SENSORS.map((s) => {
            const on = selected.has(s.key);
            return (
              <label key={s.key} onClick={() => toggleSensor(s.key)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${on ? s.color + '55' : 'var(--border)'}`,
                  background: on ? s.color + '11' : 'var(--bg-1)',
                  cursor: 'pointer', transition: 'all 0.18s', userSelect: 'none' }}>
                <span style={{ flexShrink: 0, width: 18, height: 18, borderRadius: 5,
                  border: `2px solid ${on ? s.color : 'var(--border-strong)'}`,
                  background: on ? s.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s' }}>
                  {on && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: on ? 'var(--text-0)' : 'var(--text-2)' }}>
                  {s.label}
                  {s.unit && <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 4 }}>({s.unit})</span>}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ── Results Summary ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div className="glass" style={{ padding: '10px 18px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 6, alignItems: 'center' }}>
          <Search size={14} color="var(--primary)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{filtered.length}</span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>readings matched</span>
        </div>
        <div className="glass" style={{ padding: '10px 18px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 6, alignItems: 'center' }}>
          <CheckSquare size={14} color="var(--success)" />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{activeSensors.length}</span>
          <span style={{ fontSize: 12, color: 'var(--text-2)' }}>sensors selected</span>
        </div>
        {filtered.length > 0 && (
          <>
            <div className="glass" style={{ padding: '10px 18px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <Calendar size={14} color="var(--accent)" />
              <span style={{ fontSize: 12, color: 'var(--text-2)' }}>
                {new Date(filtered[0].t).toLocaleDateString()} – {new Date(filtered[filtered.length - 1].t).toLocaleDateString()}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Data Table ── */}
      <div className="glass" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 || activeSensors.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-3)' }}>
            <FileText size={40} style={{ marginBottom: 10 }} />
            <div style={{ fontWeight: 600 }}>{activeSensors.length === 0 ? 'Select at least one sensor' : 'No readings in selected range'}</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Adjust the filters above to see data</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Day</th>
                  {activeSensors.map((s) => (
                    <th key={s.key}>
                      <span style={{ color: s.color }}>{s.label}</span>
                      {s.unit && <span style={{ color: 'var(--text-3)', marginLeft: 3 }}>({s.unit})</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...filtered].reverse().slice(0, 200).map((row, i) => {
                  const d = new Date(row.t);
                  return (
                    <tr key={row.t + i}>
                      <td className="mono" style={{ color: 'var(--text-3)', fontSize: 11 }}>{filtered.length - i}</td>
                      <td className="mono" style={{ whiteSpace: 'nowrap' }}>{d.toLocaleDateString()}</td>
                      <td className="mono" style={{ whiteSpace: 'nowrap' }}>{d.toLocaleTimeString(undefined, { hour12: false })}</td>
                      <td style={{ color: 'var(--text-2)' }}>{d.toLocaleDateString(undefined, { weekday: 'long' })}</td>
                      {activeSensors.map((s) => {
                        const v = row[s.key];
                        const display = v === null || v === undefined ? '—' : typeof v === 'boolean' ? (v ? 'YES' : 'NO') : v;
                        return (
                          <td key={s.key} className="mono" style={{ fontWeight: 600, color: s.color }}>
                            {display}{v !== null && v !== undefined && s.unit ? <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 400 }}> {s.unit}</span> : ''}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length > 200 && (
              <div style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 12, borderTop: '1px solid var(--border)' }}>
                Showing latest 200 of {filtered.length} readings. Download CSV to get all data.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
