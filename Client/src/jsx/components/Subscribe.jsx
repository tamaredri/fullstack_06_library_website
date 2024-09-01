import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './../../css/Subscribe.module.css'


export default function Subscribe({ userData }) {
    const userid = localStorage.getItem('currentUser');

    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const [load, setLoad] = useState(false);

    const phone = useRef("");
    const mail = useRef("");
    const address = useRef("");
    let subscriptionLength = 1;

    function handleSelectSubscriptionLength(e) {
        subscriptionLength = parseInt(e.target.value);
        console.log(e.target.value);
    }

    function submitSubscription(e) {
        e.preventDefault();

        const date = new Date();
        date.setMonth(date.getMonth() + subscriptionLength);

        const user = {
            "Name": userid,
            "Phone": phone.current.value,
            "Email": mail.current.value,
            "Address": address.current.value,
            "SubscriptionExpiration": date.toISOString()
        };
        console.log(user);

        const subscribeUser = async () => {
            try {
                const response = await fetch(`http://localhost:3000/library/subscribedUsers`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(user),
                    });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                setLoad(true);
                setTimeout(() => {
                    setLoad(false);
                    navigate(`/user/personalarea`);
                }, 3000);

            }
            catch (error) {
                console.error(error.message.toUpperCase());
            }

        }
        subscribeUser();
    }

    return <div style={{display: 'flex', flexDirection:'column', alignItems:'center'}}>
        <p>
            {userid},
        </p>
        <p>
            please enter your information
        </p>

        <form className={style.register_form} onSubmit={submitSubscription}>
                <div className={style.buttonsContainer}>

                    <input className={style.register_input}
                        ref={phone}
                        id="phone"
                        type="text"
                        placeholder="Phone"
                        required />
                    <input className={style.register_input}
                        ref={mail}
                        id="mail"
                        type="text"
                        placeholder="Mail"
                        required />
                    <input className={style.register_input}
                        ref={address}
                        id="address"
                        type="text"
                        placeholder="Address"
                        required />
                        </div>

                    <p style={{width: '100vw', textAlign:"center"}}>select your subscription length:</p>
                        <div className={style.buttonsContainer}>
                        <label>
                            <input
                                type="radio"
                                name="expiration"
                                value="1"
                                defaultChecked
                                onChange={handleSelectSubscriptionLength}
                            />
                            1 Month
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="expiration"
                                value="3"
                                onChange={handleSelectSubscriptionLength}
                            />
                            3 Months
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="expiration"
                                value="6"
                                onChange={handleSelectSubscriptionLength}
                            />
                            6 Months
                        </label>
                        </div>

            <input className={`${style.register_input} ${style.submit}`}
                type="submit"
                value="Subscribe" />
            <span id="existError" className={style.error_message}>{errorMessage}</span>
        </form>

        {load && <div className={style.blur_overlay}></div>}
        {load && <div className={style.success_animation}>✔</div>}
    </div>
}
