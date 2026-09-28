import os

login_path = r'd:\NeuroSense\frontend\src\pages\Login.tsx'

login_code = """import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginProps {
  setIsAuthenticated: (auth: boolean) => void;
}

export default function Login({ setIsAuthenticated }: LoginProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'login' | 'signup' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.token) {
        localStorage.setItem('neurosense_token', response.data.token);
        localStorage.setItem('neurosense_patient_id', response.data.patient_id);
        setIsAuthenticated(true);
        navigate('/');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/signup', {
        email,
        password
      });
      setSuccessMsg('OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-otp', {
        email,
        otp
      });

      if (response.data.message === 'User verified successfully') {
        setSuccessMsg('Account created! Please login.');
        setStep('login');
        setPassword('');
        setOtp('');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      {/* Left Branding Side */}
      <div style={{ flex: 1, backgroundColor: "#0f172a", display: "flex", flexDirection: "column", justifyContent: "center", padding: "4rem", color: "white", position: "relative", overflow: "hidden" }}>
        
        {/* Background Gradients */}
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(15,23,42,0) 70%)", zIndex: 0 }}></div>
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(15,23,42,0) 70%)", zIndex: 0 }}></div>
        
        <div style={{ position: "relative", zIndex: 1, maxWidth: "500px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ background: "linear-gradient(135deg, #a855f7 0%, #8b5cf6 100%)", borderRadius: "12px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(139,92,246,0.4)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: 0, letterSpacing: "-1px" }}>NeuroSense</h1>
          </div>
          <p style={{ fontSize: "1.1rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "3rem" }}>
            Next-generation neural analytics and real-time motor consistency monitoring for professionals.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.75rem", borderRadius: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <span style={{ fontSize: "1.05rem", fontWeight: 500, color: "#e2e8f0" }}>Multimodal Motor Assessment</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.75rem", borderRadius: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span style={{ fontSize: "1.05rem", fontWeight: 500, color: "#e2e8f0" }}>Secure End-to-End Analytics</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "0.75rem", borderRadius: "10px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <span style={{ fontSize: "1.05rem", fontWeight: 500, color: "#e2e8f0" }}>Real-time Insights & Reporting</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "420px", background: "white", padding: "3rem", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)" }}>
          
          {step === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", letterSpacing: "-0.5px" }}>Welcome Back</h2>
                <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>Sign in to access your dashboard</p>
              </div>
              
              {successMsg && <div style={{ background: "#dcfce7", color: "#166534", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: 500 }}>{successMsg}</div>}
              {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>}

              <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <input 
                  type="email" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "0.95rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", boxSizing: "border-box", transition: "0.2s" }}
                  onFocus={(e) => e.target.style.border = "1px solid #8b5cf6"}
                  onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                />
              </div>

              <div style={{ position: "relative", marginBottom: "2rem" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "0.95rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", boxSizing: "border-box", transition: "0.2s" }}
                  onFocus={(e) => e.target.style.border = "1px solid #8b5cf6"}
                  onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                />
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", background: "#8b5cf6", color: "white", border: "none", padding: "1rem", borderRadius: "12px", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", transition: "background 0.2s" }}>
                {loading ? <div style={{ width: "20px", height: "20px", border: "3px solid rgba(255,255,255,0.3)", borderRadius: "50%", borderTopColor: "white", animation: "spin 1s linear infinite" }}></div> : 'Sign In'}
              </button>

              <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "#64748b" }}>
                Don't have an account? <span style={{ color: "#8b5cf6", fontWeight: 600, cursor: "pointer" }} onClick={() => { setStep('signup'); setError(''); setSuccessMsg(''); setPassword(''); }}>Create one</span>
              </div>
            </form>
          )}

          {step === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", letterSpacing: "-0.5px" }}>Create Account</h2>
                <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>Join NeuroSense today</p>
              </div>
              
              {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>}

              <div style={{ position: "relative", marginBottom: "1.25rem" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                </div>
                <input 
                  type="email" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "0.95rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", boxSizing: "border-box", transition: "0.2s" }}
                  onFocus={(e) => e.target.style.border = "1px solid #8b5cf6"}
                  onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                />
              </div>

              <div style={{ position: "relative", marginBottom: "2rem" }}>
                <div style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", display: "flex" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <input 
                  type="password" 
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "0.95rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", boxSizing: "border-box", transition: "0.2s" }}
                  onFocus={(e) => e.target.style.border = "1px solid #8b5cf6"}
                  onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                />
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", background: "#8b5cf6", color: "white", border: "none", padding: "1rem", borderRadius: "12px", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", transition: "background 0.2s" }}>
                {loading ? <div style={{ width: "20px", height: "20px", border: "3px solid rgba(255,255,255,0.3)", borderRadius: "50%", borderTopColor: "white", animation: "spin 1s linear infinite" }}></div> : 'Sign Up'}
              </button>

              <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "#64748b" }}>
                Already have an account? <span style={{ color: "#8b5cf6", fontWeight: 600, cursor: "pointer" }} onClick={() => { setStep('login'); setError(''); setPassword(''); }}>Sign in</span>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit}>
              <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem 0", letterSpacing: "-0.5px" }}>Verification</h2>
                <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>Enter the 4-digit code sent to<br/><strong style={{ color: "#1e293b" }}>{email}</strong></p>
              </div>
              
              {error && <div style={{ background: "#fee2e2", color: "#991b1b", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
              </div>}

              <div style={{ marginBottom: "2rem" }}>
                <input 
                  type="text" 
                  placeholder="Enter 4-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                  style={{ width: "100%", padding: "1rem", fontSize: "1.5rem", textAlign: "center", letterSpacing: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#0f172a", boxSizing: "border-box", transition: "0.2s" }}
                  onFocus={(e) => e.target.style.border = "1px solid #8b5cf6"}
                  onBlur={(e) => e.target.style.border = "1px solid #e2e8f0"}
                />
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", background: "#8b5cf6", color: "white", border: "none", padding: "1rem", borderRadius: "12px", fontSize: "1rem", fontWeight: 600, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", transition: "background 0.2s" }}>
                {loading ? <div style={{ width: "20px", height: "20px", border: "3px solid rgba(255,255,255,0.3)", borderRadius: "50%", borderTopColor: "white", animation: "spin 1s linear infinite" }}></div> : 'Verify Code'}
              </button>

              <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "#64748b" }}>
                <span style={{ color: "#8b5cf6", fontWeight: 600, cursor: "pointer" }} onClick={() => { setStep('login'); setOtp(''); }}>Back to login</span>
              </div>
            </form>
          )}

        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
"""

with open(login_path, 'w') as f:
    f.write(login_code)

print("Login updated successfully.")
