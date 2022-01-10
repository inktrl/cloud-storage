import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import sizeFormat from '../../assets/js/sizeFormat'
import FileService from '../../services/FileService'

import Loader from '../../components/Loader/Loader'

import style from './downloadPage.module.scss'
import getFileTypeIcon from '../../utilities/getFileTypeIcon'

import { useFetching } from '../../hooks/fetching.hook'

const DownloadPage = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const params = useParams()

    const file = useSelector(state => state.files.file)
    const isAuth = useSelector(state => state.user.isAuth)

    const [fetchFile, isFileLoading] = useFetching(() => {
        dispatch(FileService.getFile(params.code)) 
    })

    const [fetchDownloadFile, isDownloadFileLoading] = useFetching(async () => {
        await dispatch(FileService.downloadFile(file))
    })

    useEffect(() => {
        return fetchFile()
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [])



    if ((file.accessLoginLink !== undefined) && (!file.accessLoginLink && !isAuth)) {
        history.push('/login')
    }

    function downloadClickHandler(e) {
        e.stopPropagation()
        fetchDownloadFile()
    }

    function copyClickHandler(e) {
        e.stopPropagation()

        var tempText = document.createElement("input")
        var copyButton = document.querySelector(".copy-url > span")
        var copyElement = document.querySelector(".copy-url > i")

        tempText.value = file.urlLink
        document.body.appendChild(tempText)
        tempText.select()
        document.execCommand("copy")
        document.body.removeChild(tempText)
        
        if(copyElement.classList.contains("fa-link")) {
            copyElement.classList.toggle("fa-link")
            copyElement.classList.toggle("fa-check")
            copyButton.innerText = "Copied"
            setTimeout(function() {
                copyElement.classList.toggle("fa-check")
                copyElement.classList.toggle("fa-link")
                copyButton.innerText = "Copy Link"
            }, 2500)
        }
    }
   

    if(isFileLoading || (file.accessLoginLink === undefined)) {
        return (
            <div className="col-7">
                <Loader />
            </div>
        )
    }

    return ( 
        <div className="col-7">
            {isDownloadFileLoading && <Loader />}
            <div className={style.mainColumn}>
                <div className={style.colLeft}>
                    <i className={
                        getFileTypeIcon(file.type)
                    }></i>                 
                </div>
                <div className={style.colRight}>
                    <div className={style.infoContainer}>
                        <div className={style.infoContainer__header}>
                            <h1 className={style.h1}>{file.name}</h1>
                            <br />
                            <div className={style.row}>
                                <i className="fas fa-calendar-check"></i>
                                <strong> {new Date(file.date).toLocaleDateString()}</strong><span> upload date</span>
                            </div>
                            <div className={style.row}>
                                <i className="fas fa-sd-card"></i>
                                <strong> {sizeFormat(file.size)}</strong><span> file size</span>
                            </div>
                        </div>
                        <div className={style.infoContainer__footer}>
                            {file.accessLink &&
                                <button onClick={(e) => downloadClickHandler(e)} disabled={isDownloadFileLoading}>
                                    <i className={`fa ${isDownloadFileLoading ? `fa-spinner` : `fa-download`}`}></i>
                                    { isDownloadFileLoading ? 'Loading...' : 'Download File' }
                                </button>
                            }    
                            <button onClick={(e) => copyClickHandler(e)} className="copy-url">
                                <i className="fa fa-link"></i>
                                <span>Copy Link</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) 
}

export default DownloadPage