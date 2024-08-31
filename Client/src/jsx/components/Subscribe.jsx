import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './../../css/SignupPage.module.css'


export default function Subscribe({ userData }) {
    const { userid } = useParams();

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
            "Phone": mail,
            "Mail": mail,
            "Address": mail,
            "SubscriptionExpiration": date.toISOString()
        };
        console.log(user);

        const subscribeUser = async () => {
            try {
                const response = await fetch(`http://localhost:3000/library/subscribedUsers/${userid}`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedData),
                    });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText);
                }

                setLoad(true);
                setTimeout(() => {
                    setLoad(false);
                    navigate(`/user/${userid}`);
                }, 3000);

            }
            catch (error) {
                setErrorMessage(error.message.toUpperCase());
            }

        }
        subscribeUser();

        fetch(`http://localhost:3000/library/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }
        )
            .then(async (res) => {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText);
                }

                setLoad(true);
                setTimeout(() => {
                    setLoad(false);
                    localStorage.setItem('currentUser', user.Name);
                    navigate(`/user/${user.Name}`);
                }, 3000);
            })
            .catch((error) => {
                setErrorMessage(error.message.toUpperCase());
            });
    }

    return <>
        <p>
            {userid},
        </p>
        <p>
            please enter your information
        </p>

        <form className={style.register_form} onSubmit={submitSubscription}>
            <section className={style.user_info}>
                <div className={style.inputs_container}>
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

                    <p>select your subscription length:</p>

                    <div>
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
                    </div>
                    <div>
                        <label>
                            <input
                                type="radio"
                                name="expiration"
                                value="3"
                                onChange={handleSelectSubscriptionLength}
                            />
                            3 Months
                        </label>
                    </div>
                    <div>
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
                    <span id="error"
                        className={style.error_message}>
                        {errorMessage}
                    </span>
                </div>
            </section>

            <input className={`${style.register_input} ${style.submit}`}
                type="submit"
                value="Subscribe" />
            <span id="existError" className={style.error_message}>{errorMessage}</span>
        </form>

        {load && <div className={style.blur_overlay}></div>}
        {load && <div className={style.success_animation}>✔</div>}
    </>
}
