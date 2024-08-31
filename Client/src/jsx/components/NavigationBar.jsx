import style from "../../css/NavigationBar.module.css"
import logo from '../../icon/libraryIcon.png'
import logOut from '../../icon/exit.png'
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
    const navigate = useNavigate();
    //const userName = localStorage.getItem('currentUser');

    return <>
        <div className={style.navContainer}>
            <div className={style.leftBar}>
                <img className={style.logo} src={logo} />
                <div className={style.navButton} onClick={() => { navigate(`/user/personalarea`) }}>User</div>
                <div className={style.navButton} onClick={() => { navigate(`/user/catalog`) }}>Catalog</div>
                <div className={style.navButton} onClick={() => { navigate(`/user/home`) }}>Home</div>
            </div>
            <img className={style.logOut}
                src={logOut}
                onClick={() => {
                    console.log('logout', localStorage.getItem('currentUser'));
                    localStorage.removeItem('currentUser');
                    navigate('/homepage');
                }} />

        </div>
    </>
}

export default NavigationBar;