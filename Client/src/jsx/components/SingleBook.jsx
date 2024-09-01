import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import style from '../../css/SingleBook.module.css'
import bookImage from '../../icon/book.jpg'
import blackBook from '../../icon/blackBook.png'


function SingleBook() {

  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const { bookid } = useParams();

  useEffect(() => {

    
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
    <div style={{display: 'flex', flexDirection: 'column', alignItems:'center', justifyContent: 'center'}}>
      <div className={style.header}> <span style={{color: "#294549"}}>---</span> {book.Title} {book.Author || "unknown"} <span style={{color: "#294549"}}>---</span></div>
      <div className={style.imageAndSummaryContainer}>
        <img className={style.bookImage} src={bookImage || book.ImagePath || 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png'} alt={`Cover of ${book.Title}`}/>
        <div className={style.SummaryContainer}>Summary:
          <p className={style.SummaryP}>{book.Summary || "unknown"}</p>
        </div>
      </div>

      <div className={style.hr}></div>

      <button className={style.borrowButtun}>BORROW</button>
      {book.copies.length > 0 ? (
        <ul className={style.bookList}>
          {book.copies.map(copy => (
            <li className={style.bookInList} key={copy.CopyID}>
              <div style={{display:'flex', flexDirection:'column'}}>
                <span><strong>Copy ID:</strong> {copy.CopyID}</span>
                <span><strong>Status:</strong> {copy.Status}</span>
              </div>
             
              <img className={style.blackBook} src={blackBook}/>
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
