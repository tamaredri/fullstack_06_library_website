import React, { useEffect, useState } from 'react'
import style from '../../css/FavoriteBorrowBooks.module.css'

export default function FavoriteBooks({ userid, setError }) {
  const [favorites, setFavorites] = useState([]);

  // fetch favorite books
  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      try {
        const response = await fetch(`http://localhost:3000/library/favoriteBooks/${userid}`);
        if (response.status === 404) {
          return;
        }
        const data = await response.json();

        setFavorites(data);
      } catch (error) {
        setError('Error fetching user data:', error);
      }
    };

    fetchFavoriteBooks();
  }, []);

  return (
    <>
      {favorites.length > 0 && (
        <div className={style.booksContainer}>
          <h3 className={style.favoriteHeader}>Favorite Books</h3>

          <ul className={style.bookList}>
            {favorites.map((book) => (
              <li className={style.bookInList} key={book.BookID}>
                  <span>{book.Title}</span>
                <a href={`/user/catalog/${book.BookID}`} style={{ maxWidth: '25%', padding: 'none' }}>
                  <img  className={style.bookIcon} src={book.ImagePath || "https://cdn-icons-png.flaticon.com/128/2232/2232688.png"}  />
                </a>
              </li>
            ))}
          </ul>
        </div>)}
    </>
  )
}
