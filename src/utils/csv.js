export function downloadCSV(filename, rows, headers) {
  if (!rows || rows.length === 0) { rows = [{ info: 'No data' }]; headers = ['info']; }
  const cols = headers || Object.keys(rows[0]);
  const escape = (v) => { if (v === null || v === undefined) return ''; const s = String(v); if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`; return s; };
  const csv = [cols.join(','), ...rows.map((r) => cols.map((c) => escape(r[c])).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}
export function formatTime(ts) { if (!ts) return '--'; return new Date(ts).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); }
