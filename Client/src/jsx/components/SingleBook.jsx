import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';


function SingleBook() {

  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/');
    const bookid = pathSegments[pathSegments.length - 1];
    
    fetch(`http://localhost:3000/library/books/${bookid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
        }
        return res.json();
    })
    .then((book) => {
      getBookCopies(book.BookID, book);
    })
    .catch((error) => {
      navigate(`/NotFound`);
    });
  }, []);

  function getBookCopies(bookid, bookData) {
    fetch(`http://localhost:3000/library/bookCopies/${bookid}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (res) => {
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText);
        }
        return res.json();
    })
    .then((bookCopies) => {
      setBook({ ...bookData, copies: bookCopies });
    })
    .catch((error) => {
      navigate(`/NotFound`);
    });
};

  if (book === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h2>SingleBook: {book.BookID}</h2>
      <div>
        <img src={book.ImagePath || 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png'} alt={`Cover of ${book.Title}`} style={{ maxWidth: '50px' }} />
      </div>
      <h3>{book.Title}</h3>
      <p><strong>Author:</strong> {book.Author || "unknown"}</p>
      <p><strong>Summary:</strong> {book.Summary || "unknown"}</p>

      <h3>Existing Copies</h3>
      {book.copies.length > 0 ? (
        <ul>
          {book.copies.map(copy => (
            <li key={copy.CopyID}>
              <strong>Copy ID:</strong> {copy.CopyID} - <strong>Status:</strong> {copy.Status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No copies were found or data not loaded yet.</p>
      )}
    </div>
  )
}

export default SingleBook;
