import React, { useState, useEffect } from 'react';
import { useNavigate , useParams} from 'react-router-dom';

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
        <div>
            <h1>Welcome to the Homepage</h1>
            {localStorage.getItem("currentUser") === null ? (
                <>
                    <button onClick={() => navigate('/login')}>Login</button>
                    <button onClick={() => navigate('/signup')}>Signup</button>
                </>) : (
                <>
                    <button onClick={() => navigate(`/user/catalog`)}>Catalog</button>
                    <button onClick={() => navigate(`/user/personalarea`)}>Personal Area</button>
                </>
            )}


            <div>
                <h2>Image Slideshow</h2>
                {images.length > 0 ? (
                    <img
                        src={images[currentImageIndex].ImagePath || "https://cdn-icons-png.flaticon.com/128/3038/3038089.png"}
                        alt="Slideshow"
                        style={{ width: '100px', height: '100px', minWidth: '100px', minHeight: "100px" }}
                    />
                ) : (
                    <img
                        src={"https://cdn-icons-png.flaticon.com/128/3038/3038089.png"}
                        alt="Slideshow"
                        style={{ width: '100px', height: '100px', minWidth: '100px', minHeight: "100px", margin: '0px' }}
                    />
                )}
            </div>

            <div>
                <h2>Quote Slideshow</h2>
                {quotes.length > 0 ? (
                    <blockquote>
                        <p>"{quotes[currentQuoteIndex].Quote}"</p>
                    </blockquote>
                ) : (
                    <p>No quotes to display</p>
                )}
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