import axios from 'axios'
import _http, { API_URL } from '../http/interceptor-axios'
import { message } from '../utilities/message'
import { addFile, deleteFileAction, setFiles, setFile } from '../reducers/fileReducer'
import { addUploadFile, changeUploadFile, showUploader } from '../reducers/uploadReducer'
import { showFileLoader, hideFileLoader } from '../reducers/fileReducer'

export default class FileService {

    static getFile(code) {
        return async dispatch => {
            try {
                dispatch(showFileLoader())
                const response = await axios.get(`${API_URL}/files/${code}`)
                if(response.data == null) {
                    return window.location.href ="/login"
                }
                dispatch(setFile(response.data))
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            } finally {
                dispatch(hideFileLoader())
            }
        }
    }

    static getFiles(dirId, sort) {
        return async dispatch => {
            try {
                dispatch(showFileLoader())
                let url = `/files`
                if (dirId) {
                    url = `/files?parent=${dirId}`
                }
                if (sort) {
                    url = `/files?sort=${sort}`
                }
                if (dirId && sort) {
                    url = `/files?parent=${dirId}&sort=${sort}`
                }
                const response = await _http.get(url)
                dispatch(setFiles(response.data))
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            } finally {
                dispatch(hideFileLoader())
            }
        }
    }

    static createDir(dirId, name) {
        return async dispatch => {
            try {
                const response = await _http.post(`/files`, {
                    name,
                    parent: dirId,
                    type: 'dir'
                })
                dispatch(addFile(response.data))
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            }
        }
    }
    
    static uploadFile(file, dirId) {
        return async dispatch => {
            try {
                const formData = new FormData()
                formData.append('file', file)
                if (dirId) {
                    formData.append('parent', dirId)
                }
                if(file.size > 10e6) {
                    return dispatch(message('Файл не повинен перевищувати 10 МБ'))
                }
                const uploadFile = {name: file.name, progress: 0, id: Date.now()}
                dispatch(showUploader())
                dispatch(addUploadFile(uploadFile))
                const response = await axios.post(`${API_URL}/files/upload`, formData, {
                    headers: {
                        Authorization: `Bearer ${ localStorage.getItem('token') }`
                    },
                    onUploadProgress: progressEvent => {
                        const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                        if (totalLength) {
                            uploadFile.progress = Math.round((progressEvent.loaded * 100) / totalLength)
                            dispatch(changeUploadFile(uploadFile))
                        }
                    }
                });
                dispatch(addFile(response.data))
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            }
        }
    }

    static downloadFile(file) {
        return async dispatch => {
            try {
                const response = await fetch(`${API_URL}/files/download?id=${file._id}`)
                if (response.status === 200) {
                    const blob = await response.blob()
                    const downloadUrl = window.URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = downloadUrl
                    link.download = file.name
                    document.body.appendChild(link)
                    link.click()
                    link.remove()
                } else {
                    dispatch(message("Помилка завантаження"))
                } 
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            }
        }
    }
    
    static deleteFile(file) {
        return async dispatch => {
            try {
                const response = await _http.delete(`/files?id=${file._id}`)
                dispatch(deleteFileAction(file._id))
                dispatch(message(response?.data?.message))
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            }
        }
    }
    
    static searchFiles(search) {
        return async dispatch => {
            try {
                const response = await _http.get(`/files/search?search=${search}`)
                dispatch(setFiles(response.data))
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            }
        }
    }

    static changeFirstAccess(id) {
        return async dispatch => {
            try {
                await _http.get(`/files/access/link/${id}`)
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            }
        }
    }
    
    static changeSecondAccess(id) {
        return async dispatch => {
            try {
                await _http.get(`/files/access/link-login/${id}`)
            } catch (error) {
                dispatch(message(error.response?.data?.message))
            }
        }
    }

}
