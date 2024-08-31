import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function UserInfo({ userData, setUserData, isSubscribed, isSubscriptionExpired, setIsSubscriptionExpired }) {
    const navigate = useNavigate();

    const [isInfoUpdated, setIsInfoUpdated] = useState(false);

    const phoneRef = useRef('');
    const addressRef = useRef('');
    const emailRef = useRef('');
    //const subscriptionRef = useRef('');

    useEffect(() => {
        if (isSubscribed) {
            // Check subscription status
            const currentDate = new Date();
            const expirationDate = new Date(userData.SubscriptionExpiration);

            console.log(expirationDate);
            console.log(expirationDate < currentDate);

            if (expirationDate < currentDate) {
                setIsSubscriptionExpired(true);
            }
        }

    }, [])

    const checkForChanges = () => {
        if (
            phoneRef.current.value !== userData.Phone ||
            addressRef.current.value !== userData.Address ||
            emailRef.current.value !== userData.Email
        ) {
            setIsInfoUpdated(true);
        } else {
            setIsInfoUpdated(false);
        }
    };

    const handleUpdateUserInfo = async () => {
        const updatedData = {
            Name: userData.Name,
            Phone: phoneRef.current.value,
            Address: addressRef.current.value,
            Email: emailRef.current.value,
            SubscriptionExpiration: userData.SubscriptionExpiration,
        };

        try {
            console.log(updatedData);
            const response = await fetch(
                `http://localhost:3000/library/subscribedUsers/${userData.Name}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedData),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            setIsInfoUpdated(false);
            setUserData(updatedData);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleUpdateExpirationDate = async (length) => {
        const date = new Date();
        date.setMonth(date.getMonth() + length);
        userData.SubscriptionExpiration = date.toISOString();

        handleUpdateUserInfo();
        setIsSubscriptionExpired(false);
    }

    return (
        <div>
            {!isSubscribed ? (
                <>
                    <p>Your are not subscribed.</p>
                    {/* select subscription length */}

                    <button onClick={() => navigate(`/user/subscribe`)}>
                        Subscribe
                    </button>
                </>
            ) : (
                <>
                    <h3>Your Information</h3>
                    <p>
                        <label>Name: </label>
                        {userData.Name}
                    </p>
                    <div>
                        <label>Phone:</label>
                        <input
                            type="text"
                            defaultValue={userData.Phone}
                            ref={phoneRef}
                            onBlur={checkForChanges}
                        />
                    </div>
                    <div>
                        <label>Address:</label>
                        <input
                            type="text"
                            defaultValue={userData.Address}
                            ref={addressRef}
                            onBlur={checkForChanges}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="text"
                            defaultValue={userData.Email}
                            ref={emailRef}
                            onBlur={checkForChanges}
                        />
                    </div>
                    <button onClick={handleUpdateUserInfo} disabled={!isInfoUpdated}>
                        Update Information
                    </button>

                    {isSubscriptionExpired ? (
                        <>
                            {/* select subscription length */}
                            <p>Your subscription has expired. renew:</p>
                            <button onClick={() => handleUpdateExpirationDate(1)}>
                                1 month
                            </button>
                            <button onClick={() => handleUpdateExpirationDate(3)}>
                                3 months
                            </button>
                            <button onClick={() => handleUpdateExpirationDate(6)}>
                                6 months
                            </button>
                        </>
                    ) : (
                        <div>
                            <label>Subscription Expiration Date:</label>
                            <p></p>
                            {userData.SubscriptionExpiration.split('T')[0]}
                        </div>
                    )}


                </>
            )}
        </div>
    )
}
