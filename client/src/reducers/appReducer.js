const SHOW_LOADER = 'SHOW_LOADER'
const HIDE_LOADER = 'HIDE_LOADER'
const SET_FETCH_ERROR = 'SET_FETCH_ERROR'
const DELETE_FETCH_ERROR = 'DELETE_FETCH_ERROR'

const defaultState = {
    loader: false,
    isFetchError: false,
    currentError: ''
}

export default function appReducer(state = defaultState, action) {
    switch (action.type) {
        case SHOW_LOADER: return {...state, loader: true}
        case HIDE_LOADER: return {...state, loader: false}
        case SET_FETCH_ERROR: return {...state, currentError: action.payload, isFetchError: true}
        case DELETE_FETCH_ERROR: return {...state, currentError: '', isFetchError: false}
        default:
            return state
    }
}


export const showLoader = () => ({type: SHOW_LOADER})
export const hideLoader = () => ({type: HIDE_LOADER})
export const setFetchError = error => ({type: SET_FETCH_ERROR, payload: error})
export const deleteFetchError = () => ({type: DELETE_FETCH_ERROR})