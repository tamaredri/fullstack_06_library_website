import style from './../../css/Login.module.css';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react'


function LoginPage(){
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState("");
    const userName = useRef("");
    const password = useRef("");

    function login(e){
        e.preventDefault();

        fetch(`http://localhost:3000/library/users/${userName.current.value}`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json'
            }
        })
        .then(async res => {
            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }
            return res.json();
        })
        .then(user => {
            if (user.Password === password.current.value) {
                localStorage.setItem('currentUser', user.Name);
                navigate(`/user/${user.Name}`);
            } else {
                setErrorMessage("WRONG PASSWORD");
            }
        })
        .catch((error) => {
            setErrorMessage(error.message.toUpperCase());
        });
    }

    return <>
        <form className={style.log_in_form} onSubmit={login}>
                <div className={style.log_in_input_container}>
                    <label htmlFor={style.user_name}>User Name</label>
                    <input className={style.login_input} ref={userName} id="user_name" type="text" required/>
                </div>
                <div className={style.log_in_input_container}>
                    <label htmlFor="password">Password</label>
                    <input className={style.login_input} ref={password} id="password" type="password" required/>
                </div>

                <input type="submit" className={style.submit} value="Sign In"/>
                <span className={`${style.error_span} ${style.error_message}`} id="error">{errorMessage}</span>
            </form>
    </>
}

export default LoginPage;