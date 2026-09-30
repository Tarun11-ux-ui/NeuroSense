import { API_BASE_URL } from "../config";
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_VOICE, MOCK_GAIT } from '../types';

export default function MobileCapture() {
  const { module, sessionId } = useParams<{ module: string, sessionId: string }>();
  const [status, setStatus] = useState<string>('idle');
  
  const handleRecord = () => {
    setStatus('recording');
    setTimeout(() => {
      setStatus('uploading');
      
      const payload = {
        module: module,
        data: module === 'voice' ? MOCK_VOICE : MOCK_GAIT
      };

      fetch(`${API_BASE_URL}/api/mobile/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setStatus('success');
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));

    }, 3000); // mock recording time
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', background: '#f1f5f9' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#0f172a' }}>
        NeuroSense Mobile Capture
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem' }}>
        Module: <strong style={{textTransform: 'capitalize'}}>{module}</strong>
      </p>

      {status === 'idle' && (
        <button 
          onClick={handleRecord}
          style={{ 
            background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', 
            color: 'white', border: 'none', padding: '1rem 2rem', 
            borderRadius: '12px', fontSize: '1.2rem', fontWeight: 600,
            boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.3)'
          }}
        >
          Start Recording
        </button>
      )}

      {status === 'recording' && (
        <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, background: '#ef4444', borderRadius: '50%', marginRight: 8, animation: 'pulse 1s infinite' }} />
          Recording...
        </div>
      )}

      {status === 'uploading' && (
        <div style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Uploading to Desktop...
        </div>
      )}

      {status === 'success' && (
        <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ✅ Upload successful! You can return to your desktop.
        </div>
      )}

      {status === 'error' && (
        <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>
          ❌ Failed to upload. Please try again.
        </div>
      )}
    </div>
  );
}
