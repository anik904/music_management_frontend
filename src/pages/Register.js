import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@300;400;500&display=swap');

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }

  .login-card {
    width: 100%;
    max-width: 420px;
    background: #1a1916;
    border: 1px solid #2e2c28;
    border-radius: 20px;
    padding: 48px 40px;
    position: relative;
    overflow: hidden;
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -80px;
    width: 220px;
    height: 220px;
    background: radial-gradient(circle, rgba(214, 176, 102, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(102, 149, 214, 0.1);
    border: 1px solid rgba(102, 123, 214, 0.25);
    border-radius: 20px;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 500;
    color: #007bff;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 24px;
  }

  .login-badge-dot {
    width: 6px;
    height: 6px;
    background: #007bff;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .login-heading {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 600;
    color: #f0ece4;
    margin: 0 0 6px 0;
    line-height: 1.2;
  }

  .login-subheading {
    font-size: 14px;
    color: #6b6760;
    margin: 0 0 36px 0;
    font-weight: 300;
  }

  .field-group {
    margin-bottom: 20px;
  }

  .field-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #8a8680;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .field-input {
    width: 100%;
    padding: 13px 16px;
    background: #111009;
    border: 1px solid #2e2c28;
    border-radius: 10px;
    color: #f0ece4;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 400;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .field-input::placeholder {
    color: #3a3834;
  }

  .field-input:focus {
    border-color: rgba(102, 169, 214, 0.5);
    box-shadow: 0 0 0 3px rgba(214, 176, 102, 0.08);
  }

  .password-wrapper {
    position: relative;
  }

  .password-toggle {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #4a4844;
    padding: 0;
    font-size: 16px;
    line-height: 1;
    transition: color 0.2s;
  }

  .password-toggle:hover {
    color: #8a8680;
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    margin-top: 28px;
    background: #007bff;
    color: #0f0e0c;
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
  }

  .submit-btn:hover:not(:disabled) {
    background: #007bff;
  }

  .submit-btn:active:not(:disabled) {
    transform: scale(0.99);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(15, 14, 12, 0.3);
    border-top-color: #0f0e0c;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .error-box {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 11px 14px;
    background: rgba(220, 53, 69, 0.08);
    border: 1px solid rgba(220, 53, 69, 0.2);
    border-radius: 8px;
    color: #e07080;
    font-size: 13px;
  }

  .success-box {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    padding: 11px 14px;
    background: rgba(40, 167, 69, 0.08);
    border: 1px solid rgba(40, 167, 69, 0.2);
    border-radius: 8px;
    color: #5ec97a;
    font-size: 13px;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 28px 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: #2e2c28;
  }

  .divider-text {
    font-size: 11px;
    color: #3a3834;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .register-cta {
    text-align: center;
    font-size: 13px;
    color: #5a5754;
  }

  .register-cta a {
    color: #007bff;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .register-cta a:hover {
    color: #007bff;
  }

  .login-card-enter {
    animation: cardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await registerUser(username, email, password);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Registration failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-root">
        <div className="login-card login-card-enter">

          <div className="login-badge">
            <span className="login-badge-dot" />
            Music Platform
          </div>

          <h1 className="login-heading">Create account</h1>
          <p className="login-subheading">Join and start exploring music</p>

          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Username</label>
              <input
                className="field-input"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="johndoe"
                autoComplete="username"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Email address</label>
              <input
                className="field-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                autoComplete="email"
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="password-wrapper">
                <input
                  className="field-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          {error && (
            <div className="error-box">
              <span>⚠</span>
              {error}
            </div>
          )}

          {success && (
            <div className="success-box">
              <span>✓</span>
              {success}
            </div>
          )}

          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">Have an account?</span>
            <span className="divider-line" />
          </div>

          <p className="register-cta">
            Already registered? <Link to="/login">Sign in instead</Link>
          </p>

        </div>
      </div>
    </>
  );
}

export default Register;

