import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from '../../css/HomePage.module.css'
export default function HomePage() {
    const { userid } = useParams();

    // get the list of images and quotes
    const [images, setImages] = useState([]);
    const [quotes, setQuotes] = useState([]);
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('http://localhost:3000/library/images');
                const data = await response.json();
                setImages(data);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        const fetchQuotes = async () => {
            try {
                const response = await fetch('http://localhost:3000/library/quotes');
                const data = await response.json();
                setQuotes(data);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            }
        };

        fetchImages();
        fetchQuotes();
    }, []);

    const [currentImageIndex, setCurrentImageIndex] = useState(1);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000); // Change image every 5 seconds

        const quoteInterval = setInterval(() => {
            setCurrentQuoteIndex((prevIndex) =>
                prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
            );
        }, 10000); // Change quote every 10 seconds

        return () => {
            clearInterval(imageInterval);
            clearInterval(quoteInterval);
        };
    }, [images, quotes]);


    return (
        <div className={style.homePage}>
            <h1 className={style.header}>Katzrin Library</h1>
            {localStorage.getItem("currentUser") === null &&
                <div>
                    <button className={style.registration} onClick={() => navigate('/login')}>Login</button>
                    <button className={style.registration} onClick={() => navigate('/signup')}>Signup</button>
                </div>
            }

            <div className={style.imagasAndQuotes}>

                <div>
                    {images.length > 0 ? (
                        <img className={style.LibraryImage}
                            src={images[currentImageIndex].ImagePath || "https://cdn-icons-png.flaticon.com/128/3038/3038089.png"}
                            alt="Slideshow"
                        />
                    ) : (
                        <img
                            className={style.LibraryImage}
                            src={"https://cdn-icons-png.flaticon.com/128/3038/3038089.png"}
                            alt="Slideshow"
                        />
                    )}
                </div>

                <div className={style.quotesContainer}>
                    {quotes.length > 0 ? (
                        <blockquote>
                            <p>{quotes[currentQuoteIndex].Quote}</p>
                        </blockquote>
                    ) : (
                        <p>No quotes to display</p>
                    )}
                </div>
            </div>
        </div>
    );
}



function Homepage_reut() {
    useEffect(
        () => {
            //delete previouse user if exist
            if (localStorage.getItem("currentUser"))
                localStorage.setItem("currentUser", null)
        }, []
    )
}