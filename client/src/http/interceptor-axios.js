import axios from 'axios'

export const API_URL = 'http://localhost:5000/api'
export const URL = 'http://localhost:5000/'

const _http = axios.create({
    withCredentials: true,
    baseURL: API_URL
})

_http.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

_http.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken)
            return _http.request(originalRequest)
        } catch (error) {
            console.log('Відсутня авторизація')
        }
    }
    throw error
})

export default _http