import React from 'react'
import { useSelector } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'

import ProfilePage from '../pages/ProfilePage/ProfilePage'
import AuthPage from '../pages/AuthPage/AuthPage'
import DiskPage from '../pages/DiskPage/DiskPage'
import DetailPage from '../pages/DetailPage/DetailPage'
import DownloadPage from '../pages/DownloadPage/DownloadPage'
import StorageInfo from '../components/StorageInfo/StorageInfo'

const Routes = () => {
    const isAuth = useSelector(state => state.user.isAuth)

    return (
        <div className="wrapper flex-1">
            {isAuth ?
                <Switch>
                    <Route path="/disk" exact component={DiskPage} />
                    <Route path="/profile" exact component={ProfilePage} />
                    <Route path="/detail" exact component={DetailPage} />
                    <Route path="/download/:code" exact component={DownloadPage} />
                    <Redirect to="/disk" />
                </Switch>
                :
                <Switch>
                    <Route path="/download/:code" exact component={DownloadPage} />
                    <Route path="/login" exact component={AuthPage} />
                    <Redirect to="/login" />
                </Switch>
            }
            {isAuth ? <StorageInfo /> : <div className="col-3"></div>}
        </div>
    )
}

export default Routes
