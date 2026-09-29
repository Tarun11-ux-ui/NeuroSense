import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AutoLogin({ onLogin }: { onLogin: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (token) {
      sessionStorage.setItem('neurosense_token', token);
      onLogin(); // updates parent state
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate, onLogin]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-main)' }}>
      <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
        </div>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Authenticating Mobile Session...</h2>
      </div>
    </div>
  );
}
