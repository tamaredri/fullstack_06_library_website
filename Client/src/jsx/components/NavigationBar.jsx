import style from "../../css/NavigationBar.module.css"
import logo from '../../icon/libraryIcon.png'
import logOut from '../../icon/exit.png'
import { useNavigate } from 'react-router-dom';
import { useState } from "react";

function NavigationBar(){
    const navigate = useNavigate();
    const userName = localStorage.getItem('currentUser');
    const [isSubscribe, setIsSubscribe] = useState(true);

    
    
    return <>
        <div className={style.navContainer}>
            <div className={style.leftBar}>
            <img className={style.logo} src={logo}/>
            {(isSubscribe) && <div className={style.navButton} onClick={()=>{navigate(`/user/${userName}/personalArea`)}}>User</div>}
            <div className={style.navButton} onClick={()=>{navigate(`/user/${userName}/catalog`)}}>Catalog</div>
            <div className={style.navButton} onClick={()=>{navigate(`/user/${userName}/Home`)}}>Home</div>
            </div>
            <img className={style.logOut} src={logOut} onClick={() =>{localStorage.setItem('currentUser', null); navigate('/login')}} />

        </div>
    </>
}

export default NavigationBar;