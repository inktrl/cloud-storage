import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../reducers/userReducer'

import avatarLogo from '../../assets/img/original.png'
import style from './navbar.module.scss'

const Navbar = () => {
    const dispatch = useDispatch()
    const isAuth = useSelector(state => state.user.isAuth)
    const loader = useSelector(state => state.app.loader)

    if(loader) {
        return (
            <nav>
                <div className={`wrapper ${style.navbar}`}>
                    <Link to="/" className={style.brandLogo}>
                        <img src={avatarLogo} alt="Logo" />
                        <div className={style.brandLogo__container}>
                            <p>Cloud Storage</p>
                            <span>#project</span>
                        </div>
                    </Link>
                </div>
            </nav>
        )
    }

    return (
        <nav>
            <div className={`wrapper ${style.navbar}`}>
                <Link to="/" className={style.brandLogo}>
                    <img src={avatarLogo} alt="Logo" />
                    <div className={style.brandLogo__container}>
                        <p>Cloud Storage</p>
                        <span>#project</span>
                    </div>
                </Link>
                {isAuth ?   
                    <div id="nav-mobile" className={style.profile}>
                        <NavLink to="/disk" activeClassName={style.activeMenu}>
                            <i className="fal fa-folder-open"></i>
                            <span>Disk</span>
                        </NavLink>
                        <NavLink to="/profile" activeClassName={style.activeMenu}>
                            <i className="fal fa-user-cog"></i>
                            <span>Profile</span>
                        </NavLink>
                        <NavLink to="/" onClick={() => dispatch(logout())} activeClassName=''>
                            <i className="fal fa-sign-out"></i>
                            <span>Out</span>
                        </NavLink>
                    </div>
                    :   
                    <div id="nav-mobile" className={style.profile}>
                        <NavLink to="/login" activeClassName={style.activeMenu}>
                            <i className="fal fa-sign-in"></i>
                            <span>Login</span>
                        </NavLink>
                    </div>
                }
            </div>
        </nav>
    )
}

export default Navbar