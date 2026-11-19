import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiRequest from './api';
import './books.css';
function BookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [read, setRead] = useState(false);
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await apiRequest('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, read, type }),
      });
      navigate('/books');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="book-form">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
      />
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Type"
      />
      <input
        type="checkbox"
        checked={read}
        onChange={(e) => setRead(e.target.checked)}
      />
      <label>Is Read</label>
      {error && <p role="alert">Could not create book: {error}</p>}
      <button disabled={isSubmitting} type="submit">Create Book</button>
    </form>
  );
}

export default BookForm;