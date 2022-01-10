import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { setPopupDisplay } from './reducers/fileReducer'

import Navbar from './components/Navbar/Navbar'
import Router from './routes/routes'

import AuthService from './services/AuthService'
import { useMessage } from './hooks/message.hook'
import Loader from './components/Loader/Loader'

import './App.scss'

const App = () => {
    const dispatch = useDispatch()
    const message = useMessage()

    const popupDisplay = useSelector(state => state.files.popupDisplay)
    const isFetchError = useSelector(state => state.app.isFetchError)
    const currentError = useSelector(state => state.app.currentError)
    const loader = useSelector(state => state.app.loader)
    
    if(isFetchError) {
        message(currentError)
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(AuthService.checkAuth())
        }
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [])

    return (
        <BrowserRouter>
            <div className="popup-background" onClick={() => dispatch(setPopupDisplay('none'))} style={{display: popupDisplay}}></div>
            <div className="app noselect">
                <Navbar />
                {!loader 
                    ? <Router />
                    : <Loader />
                }
            </div>
        </BrowserRouter>
    )
}

export default App