import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import BookForm from './BookForm';
import BookDetails from './BookDetails';
import BookList from './BookList';
import AuthForm from './AuthForm';
import { useAuth } from './useAuth';
import './App.css';

function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <p>Checking your session...</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function AppLayout() {
  const { user, isLoading, error, logout } = useAuth();
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    setLogoutError('');
    try {
      await logout();
    } catch (requestError) {
      setLogoutError(requestError.message);
    }
  };

  return (
    <>
      <header className="app-header">
        <Link className="app-brand" to="/books">Book Library</Link>
        <nav aria-label="Account">
          {isLoading ? (
            <span>Checking session...</span>
          ) : user ? (
            <>
              <span>Signed in as {user.username}</span>
              <button onClick={handleLogout} type="button">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      {(error || logoutError) && (
        <p className="auth-status" role="alert">{logoutError || `Could not check login status: ${error}`}</p>
      )}
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetails />} />
        <Route
          path="/books/new"
          element={
            <RequireAuth>
              <BookForm />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<AuthForm mode="login" />} />
        <Route path="/signup" element={<AuthForm mode="signup" />} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
