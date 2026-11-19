import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import apiRequest from './api';
import { useAuth } from './useAuth';
import './books.css'

const BookList = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [error, setError] = useState('');
  const [bookType, setBookType] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [typeInput, setTypeInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      const params = new URLSearchParams({ type: bookType, author: bookAuthor });
      try {
        setBooks(await apiRequest(`/api/books?${params}`));
        setError('');
      } catch (requestError) {
        setError(requestError.message);
      }
    };
    fetchBooks();
  }, [bookType, bookAuthor]);

  return (
    <div id="book-list">
      <h1>Book List</h1>
      <label>Type:</label>
      <input type="text" placeholder="Type..." value={typeInput} onChange={(e) => setTypeInput(e.target.value)} />
      <label>Author:</label>
      <input type="text" placeholder="Author..." value={authorInput} onChange={(e) => setAuthorInput(e.target.value)} />
      <button type="button" onClick={() => { setBookType(typeInput); setBookAuthor(authorInput); }}>Search</button>
      <button type="button" onClick={() => { setBookType(''); setBookAuthor(''); setTypeInput(''); setAuthorInput(''); }}>Clear</button>
      {error && <p role="alert">Could not load books: {error}</p>}
      {books.map(book => (
        <article className='book-article' key={book.id}>
          <p>Title: {book.title}</p>
          <p>Author: {book.author}</p>
          <Link to={`/books/${book.id}`}>View Details</Link>
          <hr />
        </article>
      ))}
      {(!books || books.length === 0) && <p>No books found.</p>}
      {user ? <Link to="/books/new">Add New Book</Link> : <p>Log in to add a book.</p>}
    </div>
  );
};

export default BookList;