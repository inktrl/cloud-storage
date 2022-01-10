import { setFetchError, deleteFetchError } from '../reducers/appReducer'

export const message = (text) => {
    return dispatch => {
        dispatch(setFetchError(text))
        setTimeout(() => {
            dispatch(deleteFetchError()) 
        }, 2000)
    }
}