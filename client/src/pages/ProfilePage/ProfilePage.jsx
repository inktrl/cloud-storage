import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import avatarLogo from '../../assets/img/empty-user.png'
import { URL } from '../../http/interceptor-axios'
import UserService from '../../services/UserService'
import style from './profilePage.module.scss'
import navStyle from '../../components/navPanel.module.scss'

import { message } from '../../utilities/message'

const ProfilePage = () => {
    const dispatch = useDispatch()
    const currentUser = useSelector(state => state.user.currentUser)
    const avatar = currentUser.avatar ? `${URL + currentUser.avatar}` : avatarLogo

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    const usernameCheck = (username) => {
        const reg = /^[a-zA-Z]\w*$/
        if(username.length <= 3) {
            dispatch(message('Ім\'я користувача повинно бути більше 3 символів'))
        } else if (!reg.test(username)) {
            dispatch(message('Некоректне ім\'я користувача'))
        } else {
            dispatch(UserService.updateUsername(username, currentUser.id)) 
            dispatch(message('Ім\'я користувача успішно змінено'))
            setUsername('')
        }
    }

    const emailCheck = (email) => {
        const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if(!reg.test(email)) {
            dispatch(message('Некоректна електронна адреса'))
        } else {
            dispatch(UserService.updateEmail(email, currentUser.id)) 
            dispatch(message('Електронна адреса змінена'))
            setEmail('')
        }
    }

    const passwordCheck = (password, passwordRepeat) => {
        if(password.length <= 5 || passwordRepeat.length <= 5) {
            dispatch(message('Пароль повинен бути більше 5 символів'))
        } else if(password !== passwordRepeat) {
            dispatch(message('Паролі не ідентичні'))
        } else {
            dispatch(message('Пароль успішно змінений!'))
            dispatch(UserService.updatePassword(password, currentUser.id)) 
            setPassword('')
            setPasswordRepeat('')
        }
    }

    function saveForm(e) {
        if(password || passwordRepeat) passwordCheck(password, passwordRepeat)
        if(username) usernameCheck(username)
        if(email) emailCheck(email)
    }

    function changeHandler(e) {
        const file = e.target.files[0]
        dispatch(UserService.uploadAvatar(file))
        e.target.value = ''
    }

    return (
        <div className="col-7">
            <div className={navStyle.navButtons}>
                <div className={navStyle.navButtons__left}></div>
                <div className={navStyle.navButtons__right}>
                    <Link to='/disk' className="button button-dark">
                        <i className="fas fa-chevron-left"></i>
                        Back
                    </Link>
                    <Link className="button l-margin" title="Profile Settings" to="/profile">
                        <i id="fas" className="fas fa-user-cog"></i>
                        Profile
                    </Link>
                </div>
            </div>     

            <div className="container">
                <div className={style.userBlock}>
                    <div className={style.userBlock_left}>
                        <div className={style.userBlock__image}>
                            <img src={avatar} alt="User" />
                        </div>
                        <div className={style.userBlock__info}>
                            <h1>username</h1>
                            <h2>{currentUser.username}</h2>
                            <h3>Registered: {new Date(currentUser.registrationDate).toLocaleDateString()} | Email: {currentUser.email}</h3>
                            <div className={style.infoBlock__buttons}>
                                <div className={`${style.uploadFile} button button-light`} title="Upload Photo">
                                    <label htmlFor="uploadInput" className="upload-file__label">
                                        <i className="fal fa-cloud-upload"></i>
                                        Upload photo
                                    </label>
                                    <input accept="image/*" onChange={(e)=> changeHandler(e)} type="file" id="uploadInput" className="upload-file__input"/>
                                </div>
                                <button onClick={() => dispatch(UserService.deleteAvatar())} className="button"  title="Delete Photo">
                                    <i className="fal fa-trash-alt"></i>
                                    Delete photo
                                </button>
                            </div>
                        </div> 
                    </div>
                    <div className={style.userBlock_right}>
                        <div className="h1"><i className="fal fa-user-edit r-margin"></i>Profile Settings</div>
                        <p>Change your basic account settings here.</p>
                        <div className={style.userBlock__settings}>
                            <label htmlFor=""><i className="fal fa-user-tag r-margin"></i>Change username:</label>
                            <input type="text" onChange={e => setUsername(e.target.value)} value={username} placeholder='Enter new username'/>
                            <br />
                            <br />
                            <label htmlFor=""><i className="fal fa-address-book r-margin"></i>Change email:</label>
                            <input type="email" onChange={e => setEmail(e.target.value)} value={email} placeholder='Enter new email'/>
                            <br />
                            <br />
                            <label htmlFor=""><i className="fal fa-user-lock r-margin"></i>Change password:</label>
                            <input type="password" onChange={e => setPassword(e.target.value)} value={password}  placeholder='Enter new password'/>
                            <input type="password" onChange={e => setPasswordRepeat(e.target.value)} value={passwordRepeat}  placeholder='Repeat new password'/>
                        </div>
                        <div className={style.userBlock__saveBtn}><button onClick={e => saveForm(e)}><i className="fal fa-check r-margin"></i>Save</button></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage