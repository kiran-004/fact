import { useState } from 'react';
import { User, Lock, Eye, EyeOff, Cpu, Sun, Moon, LogIn, ShieldAlert } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function Login({ onLogin, dark, setDark }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Check local demo fallback first
    if (
      !username.includes('@') &&
      ((username.toLowerCase() === 'admin' && password === 'admin') ||
       (username.toLowerCase() === 'operator' && password === 'operator'))
    ) {
      setTimeout(() => {
        onLogin(username);
      }, 600);
      return;
    }

    // Otherwise, perform actual Firebase Authentication
    try {
      const email = username.includes('@') ? username : `${username}@gmail.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      
      const loggedInUser = fbUser.displayName || fbUser.email.split('@')[0];
      onLogin(loggedInUser);
    } catch (err) {
      console.error('Firebase Auth error:', err);
      let errMsg = 'Failed to authenticate. Please check your credentials.';
      if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        errMsg = 'Incorrect email/username or password.';
      } else if (err.code === 'auth/network-request-failed') {
        errMsg = 'Network connection failed. Please check your connection.';
      } else if (err.message) {
        errMsg = err.message.replace('Firebase: ', '');
      }
      setError(errMsg);
      setLoading(false);
    }
  };

  const handleQuickFill = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-0)',
        zIndex: 100,
        overflow: 'hidden',
        transition: 'background 0.3s ease',
      }}
    >
      {/* Background ambient glowing spheres */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(59, 130, 246, 0.12)',
          filter: 'blur(80px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '15%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.08)',
          filter: 'blur(100px)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Theme Toggle Button */}
      <button
        onClick={() => setDark(!dark)}
        className="btn btn-ghost glass"
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          padding: 12,
          borderRadius: '50%',
          zIndex: 10,
        }}
        title="Toggle theme"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Login Card */}
      <div
        className="glass fade-in"
        style={{
          width: '100%',
          maxWidth: 440,
          padding: '40px 32px',
          zIndex: 2,
          margin: 16,
          boxShadow: 'var(--shadow)',
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 24px -6px rgba(59,130,246,0.5)',
            }}
          >
            <Cpu size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-0)', letterSpacing: '-0.02em' }}>
            Factory Control Portal
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 6 }}>
            Sign in to access industrial telemetry & command center
          </p>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--danger-soft)',
              border: '1px solid var(--danger)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 14px',
              marginBottom: 20,
              color: 'var(--danger)',
              fontSize: 13,
            }}
          >
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-2)',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-3)',
                }}
              >
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="Enter username"
                className="input"
                style={{ paddingLeft: 42 }}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text-2)',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-3)',
                }}
              >
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                className="input"
                style={{ paddingLeft: 42, paddingRight: 42 }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-3)',
                }}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              padding: '12px',
              justifyContent: 'center',
              marginTop: 10,
              fontSize: 14,
              height: 46,
            }}
            disabled={loading}
          >
            {loading ? (
              <span
                style={{
                  display: 'inline-block',
                  width: 18,
                  height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'pulse-ring 1s linear infinite',
                }}
              />
            ) : (
              <>
                <LogIn size={16} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Section */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: '1px solid var(--border)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
            Demo Access Credentials
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => handleQuickFill('admin', 'admin')}
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 6 }}
              disabled={loading}
            >
              Admin Fill
            </button>
            <button
              onClick={() => handleQuickFill('operator', 'operator')}
              className="btn btn-ghost"
              style={{ padding: '6px 12px', fontSize: 11, borderRadius: 6 }}
              disabled={loading}
            >
              Operator Fill
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
