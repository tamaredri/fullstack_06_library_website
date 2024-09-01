import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import style from '../../css/SingleBook.module.css'
import bookImage from '../../icon/book.jpg'
import blackBook from '../../icon/blackBook.png'


function SingleBook() {

  const navigate = useNavigate();
  const { bookid } = useParams();
  const userName = localStorage.getItem('currentUser');

  const [bookInfo, setBookInfo] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCopyAvailable, setIsCopyAvailable] = useState(false);


  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/library/books/${bookid}`);
        if (!response.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        const bookResponse = await response.json();

        getBookCopies(bookResponse.BookID, bookResponse);
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate(`/NotFound`);
      }
    };

    fetchBookDetails();
  }, []);


  function getBookCopies(bookid, bookData) {
    const fetchBookCopies = async () => {
      try {
        const response = await fetch(`http://localhost:3000/library/bookCopies/${bookid}`);
        if (!response.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        const bookCopies = await response.json();

        setBookInfo({ ...bookData, copies: bookCopies })

        if (bookCopies.find(b => b.Status === 'Available'))
          setIsCopyAvailable(true);

      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate(`/NotFound`);
      }
    };

    fetchBookCopies();
  };

  useEffect(() => {
    const fetchSubscribedUsersData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/library/subscribedUsers/${userName}`);
        if (!response.ok) {
          return;
        } else setIsSubscribed(true);
      } catch (error) {
        console.error(`Error fetching user data:! ${error}`);
      }
    }

    fetchSubscribedUsersData();
  }, []);

  const BorrowBook = () => {
    const requestBorrowBook = async () => {
      try {
        const response = await fetch(`http://localhost:3000/library/borrowedBooks/${userName}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ BookID: bookid }),
          }
        );
        if (!response.ok) {

          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();

        setBookInfo((book) => {
          const result = {
            ...book, copies: book.copies.map((item) => {
              if (item.CopyID === data.CopyID) {
                return { ...item, Status: "Borrowed" };
              }
              return item;
            })
          }
          if (!result.copies.find(b => b.Status === 'Available')) {
            setIsCopyAvailable(false);
          }
          return result;
        });

      } catch (error) {
        console.error(`Error fetching user data:! ${error}`);
      }
    }

    requestBorrowBook();
  }

  if (bookInfo === null) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className={style.header}>
        <span style={{ color: "#294549" }}>---</span> {bookInfo.Title} {bookInfo.Author || "unknown"} <span style={{ color: "#294549" }}>---</span>
      </div>
      <div className={style.imageAndSummaryContainer}>
        <img className={style.bookImage}
          src={bookImage || bookInfo.ImagePath || 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png'}
          alt={`Cover of ${bookInfo.Title}`} />

        <div className={style.SummaryContainer}>Summary:
          <p className={style.SummaryP}>{bookInfo.Summary || "unknown"}</p>
        </div>
      </div>

      <div className={style.hr}></div>

      {isSubscribed &&
        <button
          className={style.borrowButtun}
          onClick={BorrowBook}
          disabled={!isCopyAvailable}

        >BORROW</button>}

      {bookInfo.copies.length > 0 ? (
        <ul className={style.bookList}>
          {bookInfo.copies.map(copy => (
            <li className={style.bookInList} key={copy.CopyID}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span><strong>Copy ID:</strong> {copy.CopyID}</span>
                <span><strong>Status:</strong> {copy.Status}</span>
              </div>

              <img className={style.blackBook} src={blackBook} />
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
