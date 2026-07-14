import { useEffect, useRef, useState } from 'react';
import { subscribe } from '../services/firebase';

export const GAS_TYPES = [
  { key: 'Gas', label: 'Gas (Raw)', unit: 'ppm', color: '#3b82f6' },
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
    const paths = [['Sensors','Sensors'],['Relay1','Relay1'],['Relay2','Relay2'],['Alert','Alert'],['Settings','Settings']];
    unsubs.current = paths.map(([key, path]) => subscribe(path, (val) => { setData((prev) => ({ ...prev, [key]: val ?? prev[key] })); setLoading(false); }));
    return () => unsubs.current.forEach((u) => u && u());
  }, []);
  return { data, loading };
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
