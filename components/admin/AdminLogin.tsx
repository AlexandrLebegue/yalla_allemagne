'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaLock, FaSignInAlt, FaExclamationTriangle, FaShieldAlt } from 'react-icons/fa';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '20px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '480px' }}
      >
        {/* Main Card */}
        <div style={{ 
          background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 10px 30px rgba(233, 69, 96, 0.3)'
              }}
            >
              <FaShieldAlt style={{ fontSize: '36px', color: 'white' }} />
            </motion.div>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: 'white', 
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              Admin Panel
            </h1>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '15px' }}>
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <label 
                htmlFor="password" 
                style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  marginBottom: '10px' 
                }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <FaLock style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'rgba(255, 255, 255, 0.4)',
                  fontSize: '16px'
                }} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '16px 16px 16px 48px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#e94560';
                    e.target.style.boxShadow = '0 0 0 3px rgba(233, 69, 96, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}
              >
                <FaExclamationTriangle style={{ color: '#ef4444', flexShrink: 0 }} />
                <span style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 10px 30px rgba(233, 69, 96, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <div style={{
                  width: '22px',
                  height: '22px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderTopColor: 'white',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }} />
              ) : (
                <>
                  <FaSignInAlt style={{ fontSize: '18px' }} />
                  Sign In
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.4)', 
          marginTop: '24px', 
          fontSize: '13px' 
        }}>
          Protected admin area • Not indexed
        </p>
      </motion.div>

      {/* Spinner Animation */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
