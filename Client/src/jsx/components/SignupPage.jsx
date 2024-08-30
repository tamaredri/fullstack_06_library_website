import { useState, useRef , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import style from './../../css/SignupPage.module.css'


function SignupPage(){

    //const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [load, setLoad] = useState(false);

    const authPassword = useRef("");

    function checkAuthPassword(){
        if ((password !== authPassword.current.value))
            setPasswordErrorMessage("Authority password does not match.");
        else
            setPasswordErrorMessage("");
    }

    function signup(e) {
        e.preventDefault();

        if(password !== authPassword.current.value) return;
    
        fetch(`http://localhost:3000/library/users/${userName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(async (response) => {
            if (response.ok) { //user already exist
                setErrorMessage("THIS USER NAME ALREADY EXISTS");
                return;
            }
            register();
        })
    }

    function register() {
        const user = {
            "Name": userName,
            "Password": password,
        };
    
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
                // navigate('/HomePage');
            }, 3000);
        })
        .catch((error) => {
            setErrorMessage(error.message.toUpperCase());
        });
    }

        
    return <>
        <form className={style.register_form} onSubmit={signup}>
            <section className={style.user_info}>
                <div className={style.inputs_container}>
                    <input className={style.register_input} value={userName} onChange={(e)=>setUserName(e.target.value)} id="user_name" type="text" placeholder="User Name" required/>
                    <input className={style.register_input} value={password} onChange={(e)=>setPassword(e.target.value)} id="password" type="password" placeholder="password" required/>
                    <input className={style.register_input} ref={authPassword} onChange={checkAuthPassword} id="authpassword" type="password" placeholder="authpassword" required/>
                    <span id="authpasswordError" className={style.error_message}>{passwordErrorMessage}</span>
                </div>
            </section>
            <input className={`${style.register_input} ${style.submit}`} type="submit" value="Sign Up"/>
            <span id="existError" className={style.error_message}>{errorMessage}</span>
        </form>
        {load && <div className={style.blur_overlay}></div>}
        {load && <div className={style.success_animation}>✔</div>}
    </>
}

export default SignupPage;