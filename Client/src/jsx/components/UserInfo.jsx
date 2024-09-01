import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import style from '../../css/UserInfo.module.css'
import userIcon from '../../icon/user.png'

export default function UserInfo({ userData, setUserData, isSubscribed, isSubscriptionExpired, setIsSubscriptionExpired }) {
    const navigate = useNavigate();

    const [isInfoUpdated, setIsInfoUpdated] = useState(false);
    const [load, setLoad] = useState(false);

    const phoneRef = useRef('');
    const addressRef = useRef('');
    const emailRef = useRef('');
    //const subscriptionRef = useRef('');

    useEffect(() => {
        checkIsSubscriptionExpired();
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
            checkIsSubscriptionExpired();

            setLoad(true);
            setTimeout(() => {
                setLoad(false);
            }, 3000);
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    const handleUpdateExpirationDate = async (length) => {
        const date = new Date();
        date.setMonth(date.getMonth() + length);
        userData.SubscriptionExpiration = date.toISOString();

        handleUpdateUserInfo();
    }

    function checkIsSubscriptionExpired() {
        if (isSubscribed) {
            // Check subscription status
            const currentDate = new Date();
            const expirationDate = new Date(userData.SubscriptionExpiration);
            if (expirationDate < currentDate) {
                setIsSubscriptionExpired(true);
            }
            else
                setIsSubscriptionExpired(false);
        }
    }

    return (
        <div>
            {!isSubscribed ? (
                <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    <div className={style.infoContainer}>
                        <img className={style.userImage} src={userIcon}/>
                        <div  className={style.infoField}>
                                <label className={style.infoFieldLabel}>Name: </label>
                                {userData.Name}
                        </div>
                    </div>
                    <p>Your are not subscribed.</p>
                    <button className={style.updateBotton} onClick={() => navigate(`/user/subscribe`)}>
                        Subscribe
                    </button>
                </div>
            ) : (
                <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
                    <div className={style.infoContainer}>
                        <img className={style.userImage} src={userIcon}/>
                        <div>
                            <div className={style.infoField}>
                            <label className={style.infoFieldLabel}>Name: </label>
                            {userData.Name}
                            </div>
                            <div className={style.infoField}>
                                <label className={style.infoFieldLabel}>Phone:</label>
                                <input 
                                    type="text"
                                    defaultValue={userData.Phone}
                                    ref={phoneRef}
                                    onBlur={checkForChanges}
                                />
                            </div>
                        
                            <div className={style.infoField}>
                                <label className={style.infoFieldLabel}>Address:</label>
                                <input
                                    type="text"
                                    defaultValue={userData.Address}
                                    ref={addressRef}
                                    onBlur={checkForChanges}
                                />
                            </div>
                            <div className={style.infoField}>
                                <label className={style.infoFieldLabel}>Email:</label>
                                <input
                                    type="text"
                                    defaultValue={userData.Email}
                                    ref={emailRef}
                                    onBlur={checkForChanges}
                                />
                            </div>
                            <button className={style.updateBotton} onClick={handleUpdateUserInfo} disabled={!isInfoUpdated}>
                            Update
                            </button>
                            {load && <div className={style.blur_overlay}></div>}
                            {load && <div className={style.success_animation}>✔</div>}
                        </div>
                        
                    </div>

                    <div className={style.hr}></div>
                    

                    {isSubscriptionExpired ? (
                        <>
                            {/* select subscription length */}
                            <p style={{marginTop: 0}}>Your subscription has expired. renew:</p>
                            <div style={{display: 'flex', flexDirection:'row', alignItems:'center'}}>
                                <button className={style.standartButton} onClick={() => handleUpdateExpirationDate(1)}>
                                    1 month
                                </button>
                                <button className={style.standartButton} onClick={() => handleUpdateExpirationDate(3)}>
                                    3 months
                                </button>
                                <button className={style.standartButton} onClick={() => handleUpdateExpirationDate(6)}>
                                    6 months
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{textAlign: 'center'}}>
                            <h3 style={{marginTop: 0}}>Subscription Expiration Date:</h3>
                            <span>{userData.SubscriptionExpiration.split('T')[0]}</span>
                        </div>
                    )}


                </div>
            )}


        </div>
    )
}
