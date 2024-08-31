import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import FavoriteBooks from './FavoriteBooks';
import BorrowedBooks from './BorrowedBooks';
import UserInfo from './UserInfo';

export default function PersonalArea() {
  const { userid } = useParams();

  const [userData, setUserData] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // fetch user's data
  useEffect(() => {
    const fetchSubscribedUsersData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/library/subscribedUsers/${userid}`);
        if (response.status === 404) {
          setUserData({ Name: userid });
          return; // the user is not subscribed
        }
        else if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const data = await response.json();
        setUserData(data);

        // Check subscription status
        const currentDate = new Date();
        const expirationDate = new Date(data.SubscriptionExpiration);
        const isCurrentlySubscribed = expirationDate >= currentDate;

        if (isSubscribed !== isCurrentlySubscribed) {
          setIsSubscribed(isCurrentlySubscribed);
        }
      } catch (error) {
        setErrorMessage(`Error fetching user data:! ${error}`);
      }
    }

    fetchSubscribedUsersData();
  }, [userData]);


  if (!userData) return <div>Loading..., {errorMessage}</div>;

  return (
    <div>
      {userid != localStorage.getItem('currentUser') ? (<Navigate to='homepage' />) : (
        <>
          <h2>Hey, {userData.Name} </h2>
          {errorMessage && <p>Error: {errorMessage}</p>}

          <UserInfo userData={userData}
            setUserData={setUserData}
            isSubscribed={isSubscribed}
            setIsSubscribed={setIsSubscribed} />

          <FavoriteBooks userid={userid} setError={setErrorMessage} />

          <BorrowedBooks userid={userid} setError={setErrorMessage} />
        </>
      )}
    </div>
  );
}
