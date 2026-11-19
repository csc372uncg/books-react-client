import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiRequest from './api';
import { useAuth } from './useAuth';
import './books.css';
function BookDetails() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/books/${id}`, { method: 'DELETE' });
      navigate('/books');
    } catch (requestError) {
      setError(requestError.message);
    }
  };
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setBook(await apiRequest(`/api/books/${id}`));
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    };
    fetchBook();
  }, [id]);

  if (!book) {
    return <p>{error ? `Could not load book: ${error}` : 'Loading...'}</p>;
  }

  return (
    <>
      <div id="book-details">
        <h1>{book.title}</h1>
        <p>Author: {book.author}</p>
        <p>Type: {book.type}</p>
        <p>Is Read: {book.isRead ? 'Yes' : 'No'}</p>
        {user && <button onClick={() => handleDelete(book.id)}>Delete Book</button>}
        {error && <p role="alert">Could not delete book: {error}</p>}
      </div>
      <Link to="/books">Back to Book List</Link>
    </>
  );
}

export default BookDetails;