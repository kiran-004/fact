import { useEffect, useRef, useState } from 'react';
import { subscribe } from '../services/firebase';

export const GAS_TYPES = [
  { key: 'NH3', label: 'NH3', unit: 'ppm', color: '#06b6d4' },
  { key: 'NOx', label: 'NOx', unit: 'ppm', color: '#f59e0b' },
  { key: 'Alcohol', label: 'Alcohol', unit: 'ppm', color: '#a855f7' },
  { key: 'Benzene', label: 'Benzene', unit: 'ppm', color: '#ec4899' },
  { key: 'Smoke', label: 'Smoke', unit: 'ppm', color: '#64748b' },
  { key: 'CO2', label: 'CO2', unit: 'ppm', color: '#ef4444' },
];

export function useFirebaseData() {
  const [data, setData] = useState({
    Sensors: { Temperature: null, Humidity: null, Gas: null, Motion: null },
    Relay1: { Status: null }, Relay2: { Command: null, Status: null },
    Alert: { Status: null, Message: null }, Settings: {},
  });
  const [loading, setLoading] = useState(true);
  const unsubs = useRef([]);
  useEffect(() => {
    const paths = [['Sensors','SmartHome/Sensors'],['Relay1','SmartHome/Relay1'],['Relay2','SmartHome/Relay2'],['Alert','SmartHome/Alert'],['Settings','SmartHome/Settings']];
    unsubs.current = paths.map(([key, path]) => subscribe(path, (val) => { setData((prev) => ({ ...prev, [key]: val ?? prev[key] })); setLoading(false); }));
    return () => unsubs.current.forEach((u) => u && u());
  }, []);
  return { data, loading };
}

function parseTimestamp(ts) {
  if (ts === null || ts === undefined) return NaN;
  if (typeof ts === 'number') {
    if (ts >= 946684800000) return ts;
    if (ts >= 946684800 && ts < 9999999999) return ts * 1000;
    return NaN;
  }
  if (typeof ts === 'string') {
    if (/^\d+$/.test(ts)) {
      const num = Number(ts);
      if (num >= 946684800000) return num;
      if (num >= 946684800 && num < 9999999999) return num * 1000;
      return NaN;
    }
    const isoStr = ts.includes(' ') ? ts.replace(' ', 'T') : ts;
    const parsed = new Date(isoStr).getTime();
    if (!isNaN(parsed) && parsed >= 946684800000) return parsed;
    return NaN;
  }
  return NaN;
}

function flattenHistory(obj) {
  if (!obj || typeof obj !== 'object') return [];
  if (obj.Timestamp !== undefined) {
    return [obj];
  }
  const entries = [];
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      entries.push(...flattenHistory(obj[key]));
    }
  }
  return entries;
}

export function useFirebaseHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribe('SmartHome/History', (val) => {
      if (!val) {
        setHistory([]);
        setLoading(false);
        return;
      }
      const entries = flattenHistory(val)
        .map((entry) => {
          const tVal = parseTimestamp(entry.Timestamp);
          return {
            Temperature: entry.Temperature,
            Humidity: entry.Humidity,
            NH3: entry.NH3,
            NOx: entry.NOx,
            Alcohol: entry.Alcohol,
            Benzene: entry.Benzene,
            Smoke: entry.Smoke,
            CO2: entry.CO2,
            Motion: entry.Motion === true || entry.Motion === 'True' || entry.Motion === 'true' || entry.Motion === 1 || entry.Motion === 'Detected',
            Relay1_Status: entry.Relay1 === true || entry.Relay1 === 'True' || entry.Relay1 === 'true' || entry.Relay1 === 'ON' || entry.Relay1 === 1 ? 'ON' : 'OFF',
            Relay2_Status: entry.Relay2 === true || entry.Relay2 === 'True' || entry.Relay2 === 'true' || entry.Relay2 === 'ON' || entry.Relay2 === 1 ? 'ON' : 'OFF',
            Alert_Status: entry.Alert === true || entry.Alert === 'True' || entry.Alert === 'true' || entry.Alert === 'Active' || entry.Alert === 1 ? 'Active' : 'Clear',
            Alert_Message: entry.AlertMessage || entry.Alert_Message || (entry.Alert === true || entry.Alert === 'True' || entry.Alert === 'true' || entry.Alert === 1 ? 'Alert active' : ''),
            t: tVal,
          };
        })
        .filter((e) => !isNaN(e.t))
        .sort((a, b) => a.t - b.t);
      console.log('Firebase History fetched entries count:', entries.length, entries);
      setHistory(entries);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, []);

  return { history, loading };
}

export function useReadingHistory() {
  const [history, setHistory] = useState(() => { try { const raw = localStorage.getItem('fms_history'); return raw ? JSON.parse(raw) : []; } catch { return []; } });
  const lastSig = useRef('');
  const addReading = (reading) => {
    if (!reading) return;
    const sig = JSON.stringify(reading);
    if (sig === lastSig.current) return;
    lastSig.current = sig;
    const entry = { ...reading, t: Date.now() };
    setHistory((prev) => { const next = [...prev, entry]; if (next.length > 500) next.splice(0, next.length - 500); try { localStorage.setItem('fms_history', JSON.stringify(next)); } catch {} return next; });
  };
  const clearHistory = () => { setHistory([]); try { localStorage.removeItem('fms_history'); } catch {} };
  return { history, addReading, clearHistory };
}

export function useAlertHistory() {
  const [alerts, setAlerts] = useState(() => { try { const raw = localStorage.getItem('fms_alerts'); return raw ? JSON.parse(raw) : []; } catch { return []; } });
  const lastAlertSig = useRef('');
  const addAlert = (alert) => {
    if (!alert) return;
    const sig = JSON.stringify(alert);
    if (sig === lastAlertSig.current) return;
    lastAlertSig.current = sig;
    setAlerts((prev) => [...prev, alert].slice(-200));
    try { const raw = localStorage.getItem('fms_alerts'); const prev = raw ? JSON.parse(raw) : []; const next = [...prev, alert].slice(-200); localStorage.setItem('fms_alerts', JSON.stringify(next)); } catch {}
  };
  const clearAlerts = () => { setAlerts([]); try { localStorage.removeItem('fms_alerts'); } catch {} };
  return { alerts, addAlert, clearAlerts };
}
