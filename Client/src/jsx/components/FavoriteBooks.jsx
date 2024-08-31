import React, { useEffect, useState } from 'react'

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
    <div>
      {favorites.length > 0 && (
        <>
          <h3>Favorite Books</h3>
          <ul>
            {favorites.map((book) => (
              <li key={book.BookID}><div>
                {book.Title}
                <img src={book.ImagePath || "https://cdn-icons-png.flaticon.com/128/2232/2232688.png"} style={{ maxWidth: '50px' }} />
              </div></li>
            ))}
          </ul>
        </>)}
    </div>
  )
}
