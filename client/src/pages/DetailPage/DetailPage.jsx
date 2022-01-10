import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, Link } from 'react-router-dom'
import { QRCode } from 'react-qrcode-logo'
import FileService from '../../services/FileService'
import Chart from './Chart'

import navStyle from '../../components/navPanel.module.scss'
import navDiskStyle from '../../components/diskNavbar.module.scss'

import style from './detailPage.module.scss'

import { useFetching } from '../../hooks/fetching.hook'
import { URL } from '../../http/interceptor-axios'
import whiteCube from '../../assets/img/qr-square.png'
import avatarLogo from '../../assets/img/original.png'
import Loader from '../../components/Loader/Loader'

const DetailPage = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const file = useSelector(state => state.files.file)

    const [firstAccess, setFirstAccess] = useState(file.accessLink)
    const [secondAccess, setSecondAccess] = useState(file.accessLoginLink)

    const [fetchDownloadFile, isDownloadFileLoading] = useFetching(async () => {
        await dispatch(FileService.downloadFile(file))
    })

    const [renameAccess, setRenameAccess] = useState(false)
    const [input, setInput] = useState(file.name)

    const currentUser = useSelector(state => state.user.currentUser)
    const avatar = currentUser.avatar ? `${URL + currentUser.avatar}` : avatarLogo

    function backHandler(e) {
        e.stopPropagation()
        history.push('/disk')
    }

    function downloadClickHandler(e) {
        e.stopPropagation()
        fetchDownloadFile()
    }

    function deleteClickHandler(e) {
        e.stopPropagation()
        dispatch(FileService.deleteFile(file))
        history.push('/disk')
    }

    function copyClickHandler(e) {
        e.stopPropagation()

        var tempText = document.createElement("input")
        var copyElement = document.getElementById("copy-url-i")
        var copyButton = document.getElementById("copy-url")

        tempText.value = file.urlLink
        document.body.appendChild(tempText)
        tempText.select()
        document.execCommand("copy")
        document.body.removeChild(tempText)
        
        if(copyElement.classList.contains("fa-link")) {
            copyButton.classList.add(`${navDiskStyle.active}`)
            copyElement.classList.toggle("fa-link")
            copyElement.classList.toggle("fa-check")
            setTimeout(function() {
                copyButton.classList.remove(`${navDiskStyle.active}`)
                copyElement.classList.toggle("fa-check")
                copyElement.classList.toggle("fa-link")
            }, 2500)
        }
    }

    function onDropdownHandler(e) {
        const isDropdownButton = e.target.matches("[data-dropdown-button]")
        if(!isDropdownButton && e.target.closest("[data-dropdown]") != null) return

        let currentDropdown
        if (isDropdownButton) {
            currentDropdown = e.target.closest("[data-dropdown]")
            currentDropdown.classList.toggle(`${style.active}`)
        }

        document.querySelectorAll(`[data-dropdown].${style.active}`).forEach(dropdown => {
            if (dropdown === currentDropdown) return
            dropdown.classList.remove(`${style.active}`)
        })
    }

    const changeHandler = (event) => {
        setInput(event.target.value)
    }

    function renameFile(e) {
        e.stopPropagation()
        setRenameAccess(!renameAccess)
    } 

    return (
        <div className="col-7">
            {isDownloadFileLoading && <Loader />}
            <div className={navStyle.navButtons}>
                <div className={navStyle.navButtons__left}>
                    <div title={`${file.clicks} clicks`}>
                        <i className="fas fa-fw fa-running"></i>
                        <strong> {file.clicks}</strong><span> clicks</span>
                    </div>
                    <div title={`${file.downloads} downloads`}>
                        <i className="fas fa-fw fa-download"></i>
                        <strong> {file.downloads}</strong><span> downloads</span>
                    </div>
                </div>
                <div className={navStyle.navButtons__right}>
                    <button onClick={(e) => deleteClickHandler(e)} className="button button-dark">
                        <i className="fa fa-trash"></i>
                        Delete
                    </button>
                    <button onClick={(e) => downloadClickHandler(e)} className="button button-dark l-margin" disabled={isDownloadFileLoading}>
                        <i className={`fa ${isDownloadFileLoading ? `fa-spinner` : `fa-download`}`}></i>
                        { isDownloadFileLoading ? 'Loading...' : 'Download' }
                    </button>
                    <Link className="button l-margin" title="Profile Settings" to="/profile">
                        <i id="fas" className="fas fa-user-cog"></i>
                        Profile
                    </Link>
                </div>
            </div>
            <div className="container">
                <span className={style.renameFile}>
                    <input type="text" placeholder={file.name} value={!renameAccess ? file.name : input} onChange={e => changeHandler(e)} disabled={!renameAccess} ref={input => input && input.focus()}/>
                    <i className="fal fa-pen" onClick={e => renameFile(e)}></i>
                </span>
                <br />
                <div className={navDiskStyle.diskNavbar}>
                    <button className={navDiskStyle.diskNavbar__back} onClick={(e) => backHandler(e)} title="Back">
                        <i className="fal fa-fw fa-chevron-left"></i>  
                    </button>
                    <div className={navDiskStyle.diskNavbar__path}>
                        <div>
                            <input type="text" placeholder={file.urlLink} disabled/>
                            <div onClick={(e) => onDropdownHandler(e)} className={style.dropdown} data-dropdown>
                                <div className={style.link} title="Scan QR-code" data-dropdown-button>
                                    <i className="fal fa-fw fa-qrcode" data-dropdown-button></i>
                                </div>
                                <div className={style.dropdownMenu}>
                                    <QRCode 
                                        value={file.urlLink}
                                        size={250}
                                        logoHeight={82}
                                        logoWidth={82}
                                        ecLevel={"Q"}
                                        logoImage={whiteCube}
                                        qrStyle={"dots"}
                                        eyeRadius={[
                                            {
                                                outer: [10, 10, 0, 10],
                                                inner: [0, 10, 10, 10],
                                            }, 
                                            [10, 10, 10, 0], 
                                            [10, 0, 10, 10]
                                        ]}
                                    />
                                    <img src={avatar} alt="avatarLogo" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className={navDiskStyle.diskNavbar__exLink} onClick={()=> window.open(`${file.urlLink}`, "_blank")} title="Go To Link">
                        <i className="fal fa-fw fa-external-link"></i>
                    </button>
                    <button className={navDiskStyle.diskNavbar__copyUrl} id="copy-url" onClick={(e) => copyClickHandler(e)} title="Copy Link">
                        <span><i id="copy-url-i" className={`fal fa-fw fa-link`}></i></span>
                    </button>
                </div>
                <div className="col">
                    <Chart />
                </div>
            </div>
            <br />
            <div className="container">
                <div className={style.containerBlock}>
                    <div>Security Controll</div>
                    <br />
                    <p className="mt-5px">
                        {firstAccess ? 
                            <span className={`button ${style.toggleButton}`} onClick={(e) => {
                                setFirstAccess(!firstAccess)
                                dispatch(FileService.changeFirstAccess(file._id))
                            }}>
                                <i className="fas fa-lock-open"></i>
                                <span>Allowed</span>
                            </span>
                            :
                            <span className={`button ${style.toggleButton}`} onClick={(e) => {
                                setFirstAccess(!firstAccess)
                                dispatch(FileService.changeFirstAccess(file._id))
                            }}>
                                <i className="fas fa-lock"></i>
                                <span>Access Denied</span>
                            </span>
                        }
                    - allow other users to download the file</p>
                    <br />
                    <p className="mt-5px">
                        {secondAccess ?
                            <span className={`button ${style.toggleButton}`} onClick={(e) => {
                                setSecondAccess(!secondAccess)
                                dispatch(FileService.changeSecondAccess(file._id))
                            }}>
                                <i className="fas fa-lock-open"></i>
                                <span>Allowed</span>
                            </span>
                            :
                            <span className={`button ${style.toggleButton}`} onClick={(e) => {
                                setSecondAccess(!secondAccess)
                                dispatch(FileService.changeSecondAccess(file._id))
                            }}>
                                <i className="fas fa-lock"></i>
                                <span>Access Denied</span>
                            </span>
                        }
                    - allow unregistered users to view and download the file</p>
                </div>
            </div>
        </div>
    )
}

export default DetailPage