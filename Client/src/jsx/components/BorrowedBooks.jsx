import React, { useState, useEffect } from 'react'

export default function BorrowedBooks({ userid }) {
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    // fetch borrowed books
    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await fetch(`http://localhost:3000/library/borrowedBooks/${userid}`);
                if( response.status === 404){
                    return;
                }
                const data = await response.json();

                setBorrowedBooks(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchBorrowedBooks();
    }, []);

    const handleReturnBook = async (borrowId) => {
        try {
            const response = await fetch(`http://localhost:3000/library/borrowedbooks/${userid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ BorrowID: borrowId }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            setBorrowedBooks(prevBooks => prevBooks.filter(book => book.BorrowID !== borrowId));
        } catch (error) {
            console.error(error.message.toUpperCase());
        }
    };

    return (
        <div>
            {borrowedBooks.length > 0 && (
                <>
                    <h3>Books Borrowed</h3>
                    <ul>
                        {borrowedBooks.map((book) => (
                            <li key={book.BorrowID}>
                                {book.Title}
                                <button onClick={() => handleReturnBook(book.BorrowID)}>
                                    Return Book
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}
