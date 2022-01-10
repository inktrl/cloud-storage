import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setCurrentDir, setPopupDisplay, setFileView, showFileLoader, hideFileLoader } from '../../reducers/fileReducer'
import FilesList from '../../components/FilesList/FilesList'
import FileService from '../../services/FileService'
import Loader from '../../components/Loader/Loader'
import navStyle from '../../components/navPanel.module.scss'
import navDiskStyle from '../../components/diskNavbar.module.scss'

// import { setUser } from '../../reducers/userReducer'
// import UserService from '../../services/UserService'

import './DiskPage.scss'

const Diskpage = () => {
    const dispatch = useDispatch()

    // const user = useSelector(state => state.user.currentUser)

    const currentDir = useSelector(state => state.files.currentDir)
    const dirStack = useSelector(state => state.files.dirStack)

    const files = useSelector(state => state.files.files)
    const loading = useSelector(state => state.files.loader)

    const [dragEnter, setDragEnter] = useState(false)
    const [searchName, setSearchName] = useState('')
    const [searchTimeout, setSearchTimeout] = useState(false)

    const [folder, setFolder] = useState(0)
    const [file, setFile] = useState(0)

    const [path, setPath] = useState('/')



    const readFolderAndFileCount = () => {
        var x = 0
        var y = 0
        files.map(f => {
            if(f.type === 'dir') {
                x++
            } else {
                y++
            }
            return f
        })
        setFolder(x)
        setFile(y)
    }

    useEffect(() => {
        readFolderAndFileCount()
    })

    useEffect(() => {
        dispatch(FileService.getFiles(currentDir, 'name'))
        if(currentDir) {
            var split = (dirStack[dirStack.length - 1][0].path).split('\\')
            setPath('/' + split.slice(0, split.length).join('/') + '/')
        } else {
            setPath('/')
        }

        // Оновлення даних користувача з попереднім запитом [:ПЕРЕРОБИТИ]
        // const userInfo = dispatch(UserService.getUserInfo(user.id))
        // dispatch(setUser(userInfo))


    }, // eslint-disable-next-line react-hooks/exhaustive-deps 
    [currentDir, dispatch, dirStack])


    function dragEnterHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(true)
    }

    function dragLeaveHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        setDragEnter(false)
    }

    function dropHandler(event) {
        event.preventDefault()
        event.stopPropagation()
        let files = [...event.dataTransfer.files]
        files.forEach(file => dispatch(FileService.uploadFile(file, currentDir)))
        setDragEnter(false)
    }

    function showPopupHandler() {
        dispatch(setPopupDisplay('grid'))
    }

    function backClickHandler() {
        try {
            if(currentDir) {
                dispatch(setCurrentDir(dirStack.pop()[0].id))
            }
        } catch (error) {
            console.log(error)
        }
    }

    function fileUploadHandler(event) {
        const files = [...event.target.files]
        files.forEach(file => dispatch(FileService.uploadFile(file, currentDir)))
    }

    function searchChangeHandler(e) {
        setSearchName(e.target.value)
        if(searchTimeout !== false) {
            clearTimeout(searchTimeout)
        }
        dispatch(showFileLoader())
        if(e.target.value !== '') {
            setSearchTimeout(setTimeout(() => {
                dispatch(FileService.searchFiles(e.target.value))
                dispatch(hideFileLoader())
            }, 500, e.target.value))
        } else {
            dispatch(FileService.getFiles(currentDir))
            dispatch(hideFileLoader())
        }
    }

    const v = useSelector(state => state.files.view)
    const [view, setView] = useState(v)

    function fileView() {
        if(v === 'fa-list') {
            setView('fa-th-large')
            dispatch(setFileView('fa-th-large'))
        } else {
            setView('fa-list')
            dispatch(setFileView('fa-list'))
        }
    }

    const [dragHeigh, setDragHeight] = useState('')

    useEffect(() => {
        containerHeight()
    })

    function containerHeight() {
        var n = 240
        if(!dragEnter) {
            n = document.getElementById('container').offsetHeight
            setDragHeight(n)
        } 
    }

    return (
        <div className="col-7">
            {loading && <Loader />}
            <div className={navStyle.navButtons}>
                <div className={navStyle.navButtons__left}>
                    <div title={`${file} Files`}>
                        <i className="fas fa-file"></i>
                        <strong> {file}</strong><span> {file > 1 ? "files" : "file"}</span>
                    </div>
                    <div title={`${folder} Folders`}>
                        <i className="fas fa-folder"></i>
                        <strong> {folder}</strong><span> {folder > 1 ? "folders" : "folder"}</span>
                    </div>
                </div>
                <div className={navStyle.navButtons__right}>
                    <div className={`button ${navStyle.uploadFile}`} title="Upload File">
                        <label htmlFor="uploadInput">
                            <i className="fas fa-upload"></i> 
                            Upload file
                        </label>
                        <input multiple={true} onChange={(event)=> fileUploadHandler(event)} type="file" id="uploadInput" />
                    </div>
                    <Link to="/profile" className="button button-green" title="Profile Settings" >
                        <i id="fas" className="fas fa-user-cog"></i>
                        Profile
                    </Link>
                </div>
            </div>
            {!dragEnter ?
                <div id="container" className="container" onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler}>
                    <div className="h1">Disk Storage</div>
                    <br />
                    <div className={navDiskStyle.diskNavbar}>
                        <button className={navDiskStyle.diskNavbar__back} onClick={() => backClickHandler()} title="Back">
                            {currentDir ? 
                                <i className="fal fa-chevron-left"></i>
                            :
                                <i className="fal fa-home"></i>
                            }
                        </button>
                        <button className={navDiskStyle.diskNavbar__new} onClick={() => showPopupHandler()} title="Create New Folder">
                            <i className="fal fa-folder"></i>
                        </button>
                        <div className={navDiskStyle.diskNavbar__path}>
                            <div title="Search files...">
                                <input value={searchName} onChange={e => searchChangeHandler(e)} type="text" placeholder={path}/>
                                <div><i className="fal fa-search"></i></div>
                            </div>
                        </div>
                        <button className={navDiskStyle.diskNavbar__style} onClick={fileView} title="Change Style">
                            <i className={`fal ${view}`}></i>
                        </button>
                    </div>
                    <br />
                    <FilesList />
                </div>
            :
                <div className="container drag-and-drop dashed" onDrop={dropHandler} onDragEnter={dragEnterHandler} onDragLeave={dragLeaveHandler} onDragOver={dragEnterHandler} style={{height: `${dragHeigh}px`}}>
                    <div></div>
                </div> 
            }
        </div>
    )
}

export default Diskpage
