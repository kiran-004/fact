import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Sensors from './pages/Sensors';
import Threshold from './pages/Threshold';
import Alerts from './pages/Alerts';
import RelayControl from './pages/RelayControl';
import SystemStatus from './pages/SystemStatus';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { useFirebaseData, useReadingHistory, useAlertHistory } from './hooks/useFirebase';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(() => localStorage.getItem('fms_user') || null);
  const { data, loading } = useFirebaseData();
  const { history, addReading, clearHistory } = useReadingHistory();
  const { alerts, addAlert, clearAlerts } = useAlertHistory();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    if (loading) return;
    const s = data.Sensors || {};
    const r1 = data.Relay1 || {};
    const r2 = data.Relay2 || {};
    const al = data.Alert || {};
    addReading({
      Temperature: s.Temperature, Humidity: s.Humidity, Gas: s.Gas, NH3: s.NH3, NOx: s.NOx,
      Alcohol: s.Alcohol, Benzene: s.Benzene, Smoke: s.Smoke, CO2: s.CO2, Motion: s.Motion,
      Relay1_Status: r1.Status, Relay2_Command: r2.Command, Relay2_Status: r2.Status,
      Alert_Status: al.Status, Alert_Message: al.Message,
    });
  }, [data, loading, addReading]);

  const alertActive = data.Alert?.Status === true || data.Alert?.Status === 'true' || data.Alert?.Status === 'Active';
  useEffect(() => {
    if (alertActive) {
      addAlert({ time: Date.now(), gas: data.Sensors?.Gas, motion: data.Sensors?.Motion, message: data.Alert?.Message || 'Gas leak detected', status: 'Active' });
    }
  }, [alertActive, data.Alert?.Message, data.Sensors?.Gas, data.Sensors?.Motion, addAlert]);

  const handleLogin = (username) => {
    setUser(username);
    localStorage.setItem('fms_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('fms_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} dark={dark} setDark={setDark} />;
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar onToggleSidebar={() => setSidebarOpen((o) => !o)} dark={dark} setDark={setDark} user={user} onLogout={handleLogout} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main style={{ marginLeft: sidebarOpen && window.innerWidth >= 1024 ? 248 : 0, padding: '24px', transition: 'margin 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
        <Routes>
          <Route path="/" element={<Dashboard data={data} loading={loading} history={history} alerts={alerts} />} />
          <Route path="/sensors" element={<Sensors data={data} loading={loading} history={history} onClearHistory={clearHistory} />} />
          <Route path="/threshold" element={<Threshold settings={data.Settings} />} />
          <Route path="/alerts" element={<Alerts data={data} alerts={alerts} onClear={clearAlerts} />} />
          <Route path="/relay" element={<RelayControl data={data} />} />
          <Route path="/system" element={<SystemStatus data={data} loading={loading} history={history} onClearHistory={clearHistory} />} />
          <Route path="/reports" element={<Reports history={history} />} />
        </Routes>
      </main>
    </div>
  );
}
