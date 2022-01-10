import React, { useState } from 'react'
import { useDispatch } from "react-redux"
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import AuthService from '../../services/AuthService'
import { useFetching } from '../../hooks/fetching.hook'

import style from './authPage.module.scss'
import Loader from '../../components/Loader/Loader'



const AuthPage = () => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [fetchAuth, isAuthLoading] = useFetching(async () => {
        await dispatch(AuthService.registration(email, password))
    })

    const [fetchLogin, isLoginLoading] = useFetching(async () => {
        await dispatch(AuthService.login(email, password))
    })

    return (
        <BrowserRouter>
            <Switch>
                <React.Fragment>
                    <div className="col-7">
                        {(isLoginLoading || isAuthLoading)  && <Loader />}
                        <div className={`container ${style.mainContainer}`}>
                            <div className={style.mainContainer__left}>
                                <i className="fal fa-fw fa-cloud"></i>
                            </div>
                            <div className={style.mainContainer__right}>
                                <Route path="/login">
                                    <form onSubmit={e => e.preventDefault()}>
                                        <div className={style.row}>
                                            <div>
                                                <input 
                                                    type="email"
                                                    name="email"
                                                    className="validate"
                                                    onChange={e => setEmail(e.target.value)}
                                                    value={email}
                                                    placeholder="Email"
                                                />
                                            </div>
                                            <div>
                                                <input 
                                                    type="password"
                                                    name="password"
                                                    className="validate"
                                                    onChange={e => setPassword(e.target.value)}
                                                    value={password}
                                                    placeholder="Password"
                                                />
                                            </div>
                                        </div>
                                        <div className={style.row}>
                                            <button onClick={() => {
                                                if(email && password !== '') {
                                                    fetchLogin()
                                                }
                                            }} disabled={isLoginLoading}>Login</button>
                                            <Link to="/registration">Don't have an account?</Link>
                                        </div>
                                    </form>
                                </Route>
                                <Route path="/registration">
                                    <form onSubmit={e => e.preventDefault()}>
                                        <div className={style.row}>
                                            <div>
                                                <input 
                                                    type="email" 
                                                    name="email" 
                                                    className="validate"
                                                    onChange={e => setEmail(e.target.value)}
                                                    value={email}
                                                    placeholder="Email" 
                                                />
                                            </div>
                                            <div>
                                                <input 
                                                    id="password" 
                                                    type="password" 
                                                    name="password" 
                                                    className="validate"
                                                    onChange={e => setPassword(e.target.value)} 
                                                    value={password} 
                                                    placeholder="Password"
                                                    autoComplete="current-password"
                                                />
                                            </div>
                                        </div>
                                        <div className={style.row}>
                                            <button onClick={() => {
                                                if(email && password !== '') {
                                                    fetchAuth()
                                                    setEmail('')
                                                    setPassword('')
                                                }
                                             }} disabled={isAuthLoading}>Sign In</button>
                                            <Link to="/login">Already have an account?</Link>
                                        </div>
                                    </form>
                                </Route>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            </Switch>
        </BrowserRouter>
    )
}

export default AuthPage