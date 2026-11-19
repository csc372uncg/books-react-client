import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import './auth.css';

function AuthForm({ mode }) {
  const { user, isLoading, authenticate } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isSignup = mode === 'signup';
  const returnPath = location.state?.from?.pathname || '/books';

  if (isLoading) return <p>Checking your session...</p>;
  if (user) return <Navigate to="/books" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await authenticate(mode, { username, password });
      navigate(returnPath, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <h1>{isSignup ? 'Create account' : 'Log in'}</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          autoComplete="username"
          id="username"
          maxLength={30}
          minLength={isSignup ? 3 : undefined}
          pattern={isSignup ? '[A-Za-z0-9_]{3,30}' : undefined}
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          id="password"
          minLength={isSignup ? 8 : undefined}
          required
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
        </button>
      </form>
      <p className="auth-switch">
        {isSignup ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link to={isSignup ? '/login' : '/signup'}>
          {isSignup ? 'Log in' : 'Sign up'}
        </Link>
      </p>
    </main>
  );
}

export default AuthForm;
