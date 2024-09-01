import React, { useState, useEffect } from 'react';
import BookToCatalog from './BookToCatalog';
import style from './../../css/CatalogPage.module.css';
import { Navigate, useNavigate } from 'react-router-dom';

import up from '../../icon/up.png'
import down from '../../icon/down.png'

import { useRef } from 'react';

function Search({ setList, fullList }) {

    const titleSearch = useRef("");
    const authorSearch = useRef("");

    function Titlefilter() {
        authorSearch.current.value = "";
        setList(l => fullList.filter(book => book.Title.toLowerCase().includes(titleSearch.current.value.toLowerCase())));
    }
    function Authotfilter() {
        titleSearch.current.value = "";
        setList(l => fullList.filter(book => book.Author.toLowerCase().includes(authorSearch.current.value.toLowerCase())));
    }

    function Sort(direction) {
        setList(l => {
            const sortedList = [...l].sort((b1, b2) => {
                const titleA = b1.Title.toLowerCase();
                const titleB = b2.Title.toLowerCase();

                if (direction === 'up') {
                    if (titleA < titleB) return -1;
                    if (titleA > titleB) return 1;
                    return 0;
                } else {
                    if (titleA > titleB) return -1;
                    if (titleA < titleB) return 1;
                    return 0;
                }
            });
            return sortedList;
        });
    }

    return <>
        <div className={style.searchContainer}>
            <label className={style.searchLabel}> Title:
                <input ref={titleSearch} onChange={Titlefilter} className={style.searchInput} type="text" />
            </label>
            <label className={style.searchLabel} > Author:
                <input ref={authorSearch} onChange={Authotfilter} className={style.searchInput} type="text" />
            </label>
            <label className={style.searchLabel}> Sort:
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <img onClick={() => Sort('up')} style={{ width: 11, marginLeft: 6 }} src={up} alt="" />
                    <img onClick={() => Sort('down')} style={{ width: 11, marginLeft: 6 }} src={down} alt="" />
                </div>
            </label>
        </div>
    </>

}


function CatalogPage() {

    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [presentBooks, setPresentBooks] = useState([]);
    const [favoriteBooks, setFavoriteBooks] = useState([]);
    const userName = localStorage.getItem('currentUser');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:3000/library/books', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();
                setBooks(data);
                setPresentBooks(data);
            }
            catch (error) {
                console.error(error)
            }
        }

        const fetchFavorites = async () => {
            try {
                const response = await fetch(`http://localhost:3000/library/favoriteBooks/${userName}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                const data = await response.json();

                setFavoriteBooks(data.map(book => book.BookID))
            }
            catch (error) {
                console.error(error)
            }
        }

        fetchBooks();
        fetchFavorites();

    }, []);


    function toggleFavorite(bookID) {
        setFavoriteBooks((prevFavorites) => {
            if (prevFavorites.includes(bookID)) {
                deleteAsFavorite(bookID);
                return prevFavorites.filter((id) => id !== bookID);
            } else {
                postAsFavorite(bookID);
                return [...prevFavorites, bookID];
            }
        });
    };

    function postAsFavorite(BookID) {
        const post = async () => {
            try {
                const response = await fetch(`http://localhost:3000/library/favoriteBooks/${userName}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ BookID: BookID })
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        post();
    }

    function deleteAsFavorite(BookID) {
        const deleteFavorite = async () => {
            try {
                const response = await fetch(`http://localhost:3000/library/favoriteBooks/${userName}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ BookID: BookID })
                });
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }
            }
            catch (error) {
                console.error(error);
            }
        }

        deleteFavorite();
    }

    return <div className={style.catalogPage}>

        {localStorage.getItem('currentUser') === null ?
            (<Navigate to='/homepage' />) :
            (
                <>
                    <Search setList={setPresentBooks} fullList={books} />
                    <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', flexWrap: 'wrap' }}>
                        {presentBooks.map((book) => (
                            <BookToCatalog
                                key={book.BookID}
                                BookID={book.BookID}
                                Title={book.Title}
                                Author={book.Author}
                                ImagePath={book.ImagePath}
                                isFavorite={favoriteBooks.includes(book.BookID)}
                                setIsFavorite={() => toggleFavorite(book.BookID)}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                </>

            )}
    </div>;
}

export default CatalogPage;
