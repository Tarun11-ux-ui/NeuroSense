import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the new CSS

export default function Login({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'login' | 'signup' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to request OTP');
      
      setStep('otp');
      if (data.test_otp) {
        setTimeout(() => alert(`TEST MODE: Your verification OTP is ${data.test_otp}`), 500);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to register');
      
      setSuccessMsg('Account created successfully. Please log in.');
      setStep('login');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter a valid OTP code.');
      return;
    }
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Failed to verify OTP');
      
      if (data.access_token) {
        sessionStorage.setItem('neurosense_token', data.access_token);
      }
      
      onLogin();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Branding Side */}
      <div className="login-left">
        <div className="brand-content">
          <div className="brand-logo-wrapper">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h1 className="brand-title">NeuroSense</h1>
          </div>
          <p className="brand-subtitle">
            Next-generation neural analytics and real-time brainwave monitoring for professionals.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              <span>Real-time EEG Streaming</span>
            </div>
            <div className="feature-item">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>Secure End-to-End Encryption</span>
            </div>
            <div className="feature-item">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>Instant Data Visualization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="login-right">
        <div className="login-form-container">
          
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-header">
                <h2>Welcome Back</h2>
                <p>Sign in to access your dashboard</p>
              </div>
              
              {successMsg && <div className="success-message">{successMsg}</div>}
              {error && <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>}

              <div className="input-group">
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Sign In'}
              </button>

              <div className="form-footer">
                Don't have an account? <span onClick={() => { setStep('signup'); setError(''); setSuccessMsg(''); setPassword(''); }}>Create one</span>
              </div>
            </form>
          )}

          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              <div className="form-header">
                <h2>Create Account</h2>
                <p>Join NeuroSense today</p>
              </div>
              
              {error && <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>}

              <div className="input-group">
                <input 
                  type="email" 
                  className="input-field" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>

              <div className="input-group">
                <input 
                  type="password" 
                  className="input-field" 
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Sign Up'}
              </button>

              <div className="form-footer">
                Already have an account? <span onClick={() => { setStep('login'); setError(''); setPassword(''); }}>Sign in</span>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit}>
              <div className="form-header">
                <h2>Verification</h2>
                <p>Enter the 4-digit code sent to<br/><strong>{email}</strong></p>
              </div>
              
              {error && <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>}

              <div className="input-group">
                <input 
                  type="text" 
                  className="input-field otp-input" 
                  placeholder="••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Verify Code'}
              </button>

              <div className="form-footer">
                <span onClick={() => { setStep('login'); setOtp(''); }}>Back to login</span>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
