import { useCallback, useEffect, useMemo, useState } from 'react';
import apiRequest from './api';
import AuthContext from './authContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    apiRequest('/api/auth/me')
      .then((result) => {
        if (active) setUser(result.user);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const authenticate = useCallback(async (endpoint, credentials) => {
    const result = await apiRequest(`/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    setUser(result.user);
    setError('');
  }, []);

  const logout = useCallback(async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setError('');
  }, []);

  const value = useMemo(
    () => ({ user, isLoading, error, authenticate, logout }),
    [user, isLoading, error, authenticate, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
