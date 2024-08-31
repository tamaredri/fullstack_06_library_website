import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import style from './../../css/BookToCatalog.module.css';

function BookToCatalog({ BookID, Title, Author, ImagePath, isFavorite, setIsFavorite, navigate}) {

    return (
        <div className={style.bookContainer} >
            <img onClick={()=>navigate(`./${BookID}`)}
                src={ImagePath || 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png'}
                alt={`Cover of ${Title}`}
                className={style.bookImage}
            />

            <div className={style.bookDetails}>
                <h3>{Title}</h3>
                <p><strong>Author:</strong> {Author || "Unknown"}</p>
                <p><strong>BookID:</strong> {BookID}</p>
            </div>
            <div onClick={setIsFavorite} className={style.favoriteIcon}>
                {isFavorite ? <FaHeart color="black" /> : <FaRegHeart color="grey" />}
            </div>
        </div>
    );
}

export default BookToCatalog;