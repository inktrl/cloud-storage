import _http from '../http/interceptor-axios'
import { setUser } from '../reducers/userReducer'
import { message } from '../utilities/message'

export default class UserService {

    static updateUsername(username, id) {
        return async dispatch => {
            try {
                const response = await _http.post('/user/username', {username, id})
                dispatch(setUser(response.data))
            } catch (error) {
                message(error)
            }
        }
    }

    static updateEmail(email, id) {
        return async dispatch => {
            try {
                const response = await _http.post('/user/email', {email, id})
                dispatch(setUser(response.data))
            } catch (error) {
                message(error)
            }
        }
    }

    static updatePassword(password, id) {
        return async dispatch => {
            try {
                const response = await _http.post('/user/password', {password, id})
                dispatch(setUser(response.data))
            } catch (error) {
                message(error)
            }
        }
    }

    static uploadAvatar(file) {
        return async dispatch => {
            try {
                const formData = new FormData()
                formData.append('file', file)
                const response = await _http.post(`/files/avatar`, formData)
                dispatch(setUser(response.data))
            } catch (error) {
                message(error)
            }
        }
    }

    static deleteAvatar() {
        return async dispatch => {
            try {
                const response = await _http.delete(`/files/avatar`)
                dispatch(setUser(response.data))
            } catch (error) {
                message(error)
            }
        }
    }

    static getUserInfo(id) {
        return async dispatch => {
            try {
                const response = await _http.post('/user/info', {id})
                dispatch(setUser(response.data))
            } catch (error) {
                message(error)
            }
        }
    }

}