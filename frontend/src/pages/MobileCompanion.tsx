import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_VOICE, MOCK_GAIT } from '../types';

export default function MobileCompanion() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [command, setCommand] = useState<string>('idle');
  const [status, setStatus] = useState<string>('waiting');
  
  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/companion/${sessionId}/command`);
        if (res.ok) {
          const data = await res.json();
          if (data.command !== command && data.command !== 'idle') {
            setCommand(data.command);
            setStatus('ready_to_record');
          }
        }
      } catch (err) {
        console.error(err);
      }
    }, 2000);
    return () => clearInterval(poll);
  }, [sessionId, command]);

  const handleRecord = (moduleType: string) => {
    setStatus('recording');
    setTimeout(() => {
      setStatus('uploading');
      
      const payload = {
        module: moduleType,
        data: moduleType === 'voice' ? MOCK_VOICE : MOCK_GAIT
      };

      fetch(`/api/mobile/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStatus('success');
          // Reset command to idle so we can record again if needed
          fetch(`/api/companion/${sessionId}/command`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ command: 'idle' })
          });
          setTimeout(() => { setStatus('waiting'); setCommand('idle'); }, 3000);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));

    }, 3000); // mock recording time
  };

  return (
    <div style={{ 
      padding: '2rem 1rem', 
      textAlign: 'center', 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: 'Inter, sans-serif' 
    }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#1e293b' }}>
        NeuroSense Companion
      </h1>
      <p style={{ color: '#64748b', marginBottom: '3rem', fontSize: '1rem' }}>
        Connected to Desktop
      </p>

      {status === 'waiting' && (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#8b5cf6', marginBottom: '1rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse 2s infinite' }}><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <h2 style={{ fontSize: '1.2rem', color: '#334155' }}>Waiting for Desktop...</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Please select a module on your computer to begin.
          </p>
        </div>
      )}

      {status === 'ready_to_record' && (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.4rem', color: '#334155', marginBottom: '1.5rem', textTransform: 'capitalize' }}>
            {command.replace('start_', '')} Recording
          </h2>
          <button 
            onClick={() => handleRecord(command.replace('start_', ''))}
            style={{ 
              background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', 
              color: 'white', border: 'none', padding: '1.2rem 2.5rem', 
              borderRadius: '50px', fontSize: '1.2rem', fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.3)',
              width: '100%',
              cursor: 'pointer'
            }}
          >
            Start Capture
          </button>
        </div>
      )}

      {status === 'recording' && (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#ef4444', marginBottom: '1rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'pulse 1s infinite' }}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
          </div>
          <h2 style={{ fontSize: '1.2rem', color: '#ef4444' }}>Recording...</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Speak clearly into your phone's microphone.
          </p>
        </div>
      )}

      {status === 'uploading' && (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#f59e0b', marginBottom: '1rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          </div>
          <h2 style={{ fontSize: '1.2rem', color: '#f59e0b' }}>Uploading...</h2>
        </div>
      )}

      {status === 'success' && (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ color: '#10b981', marginBottom: '1rem' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <h2 style={{ fontSize: '1.2rem', color: '#10b981' }}>Success!</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Data sent to desktop.
          </p>
        </div>
      )}

      {status === 'error' && (
        <div style={{ padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', color: '#ef4444' }}>Upload Failed</h2>
          <button onClick={() => handleRecord(command.replace('start_', ''))} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>Retry</button>
        </div>
      )}
    </div>
  );
}
