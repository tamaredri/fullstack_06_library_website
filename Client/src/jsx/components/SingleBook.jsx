import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function SingleBook({Title, Author, Summary, ImagePath}) {
    const { bookid } = useParams();
    const [copies, setCopies] = useState([]);

    useEffect(() => {
        const fetchCopies = async () => {
          try {
            const response = await axios.get(`http://localhost:3000/bookCopies/${bookid}`);
            setCopies(response.data);
          } catch (error) {
            console.error('Error fetching book copies:', error);
          }
        };
    
        fetchCopies();
      }, [bookid]);

  return (
    <div>
        <h2>SingleBook: {bookid}</h2>
      <div>
        <img src={ImagePath || 'https://cdn-icons-png.flaticon.com/128/2232/2232688.png'} alt={`Cover of ${Title}`} style={{ maxWidth: '50px' }} />
      </div>
      <h3>{Title}</h3>
      <p><strong>Author:</strong> {Author || "unknown"}</p>
      <p><strong>Summary:</strong> {Summary || "unknown"}</p>

      <h3>Existing Copies</h3>
      {copies.length > 0 ? (
        <ul>
          {copies.map(copy => (
            <li key={copy.CopyID}>
              <strong>Copy ID:</strong> {copy.CopyID} - <strong>Status:</strong> {copy.Status}
            </li>
          ))}
        </ul>
      ) : (
        <p>No copies were found or data not loaded yet.</p>
      )}
    </div>
  )
}
