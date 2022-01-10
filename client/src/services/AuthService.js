import axios from 'axios'
import _http, { API_URL } from '../http/interceptor-axios'
import { setUser } from '../reducers/userReducer'
import { message } from '../utilities/message'
import { showLoader, hideLoader } from '../reducers/appReducer'

export default class AuthService {

    static login(email, password) {
        return async dispatch => {
            try {
                const response = await _http.post('/login', {email, password})
                if(!response.data.user.isActivated) {
                    dispatch(message("Підтвердіть вашу електронну адресу: " + response.data.user.email))
                } else {
                    dispatch(setUser(response.data.user))
                }
                localStorage.setItem('token', response.data.accessToken)
            } catch (e) {
                dispatch(message(e.response?.data?.message))
            }
        }
    }

    static registration(email, password) {
        return async dispatch => {
            try {
                const response = await _http.post('/registration', {email, password})
                if(!response.data.user.isActivated) {
                    dispatch(message("Підтвердіть вашу електронну адресу: " + response.data.user.email))
                    localStorage.setItem('token', response.data.accessToken)
                }
            } catch (e) {
                dispatch(message(e.response?.data?.message))
            }
        }
    }

    static checkAuth() {
        return async dispatch => {
            try {
                dispatch(showLoader())
                const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
                localStorage.setItem('token', response.data.accessToken)
                if(response.data.user.isActivated) {
                    dispatch(setUser(response.data.user))
                }
            } catch (e) {
                // dispatch(message(e.response?.data?.message))
            } finally {
                dispatch(hideLoader())
            }
        }
    }
    
}
