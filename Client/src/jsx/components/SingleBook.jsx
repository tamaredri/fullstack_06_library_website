import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import style from '../../css/SingleBook.module.css'
import bookImage from '../../icon/book.jpg'
import blackBook from '../../icon/blackBook.png'
import style_for_load from '../../css/UserInfo.module.css'


function SingleBook() {

  const { bookid } = useParams();
  const userName = localStorage.getItem('currentUser');

  const [bookInfo, setBookInfo] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isCopyAvailable, setIsCopyAvailable] = useState(false);
  const [load, setLoad] = useState(false);


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

        setLoad(true);
        setTimeout(() => {
          setLoad(false);
        }, 3000);

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

      {localStorage.getItem('currentUser') === null ? (<Navigate to='/homepage' />) :
        (
          <>
            <div className={style.header}>
              <span style={{ color: "#294549" }}>---</span> {bookInfo.Title} {bookInfo.Author || "unknown"} <span style={{ color: "#294549" }}>---</span>
            </div>
            <div className={style.imageAndSummaryContainer}>
              <img className={style.bookImage}
                src={bookInfo.ImagePath || 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png'}
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
            {load && <div className={style_for_load.blur_overlay}></div>}
            {load && <div className={style_for_load.success_animation}>✔</div>}
            
            {!isCopyAvailable && bookInfo.copies.length > 0 && <p>All copies are taken</p>}

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
              <p>No copies were found.</p>
            )}
          </>)}
    </div>
  )
}

export default SingleBook;
