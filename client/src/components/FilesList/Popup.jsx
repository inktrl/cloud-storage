import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPopupDisplay } from '../../reducers/fileReducer'
import FileService from '../../services/FileService'
import { useFetching } from '../../hooks/fetching.hook'
import Loader from '../../components/Loader/Loader'

const Popup = () => {
    const popupDisplay = useSelector(state => state.files.popupDisplay)
    const currentDir = useSelector(state => state.files.currentDir)
    const fileView = useSelector(state => state.files.view)
    const dispatch = useDispatch()

    const [dirName, setDirName] = useState('')
    const [fetchNewFolder, isNewFolderLoading] = useFetching(async () => {
        await dispatch(FileService.createDir(currentDir, dirName))
    })


    function createHandler() {
        fetchNewFolder()
        setDirName('')
        dispatch(setPopupDisplay('none'))
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            createHandler()
        }
        if (event.key === 'Escape') {
            dispatch(setPopupDisplay('none'))
        }
    }

    const changeHandler = (event) => {
        setDirName(event.target.value)
    }


    useEffect(() => {
        if(popupDisplay === 'none') {
            setDirName('')
        }
    }, [popupDisplay])


    if(isNewFolderLoading) {
        return(
            <Loader />
        )
    }

    if(fileView === 'fa-th-large') {
        return (
            <div className="file-plate popup" style={{display: popupDisplay}}>
                <div className="file-plate__q">
                    <i className="fal fa-fw fa-folder"></i>
                </div>
                <div className="file-plate__input">
                    <input name="txt" onChange={changeHandler} value={dirName} onKeyDown={handleKeyDown} ref={input => input && input.focus()} />
                </div>
            </div>
        )
    } else {
        return (
            <div className="table-grid-file__body popup" style={{display: popupDisplay}}>
                <div className="table-grid-file__q">
                    <i className="fas fa-fw fa-folder"></i>
                </div>
                <div className="table-grid-file__w">
                    <input name="txt" onChange={changeHandler} value={dirName} onKeyDown={handleKeyDown} ref={input => input && input.focus()} />
                </div>
                <div className="table-grid-file__r rem-one" onClick={() => createHandler()}>
                    <i className="fas fa-fw fa-check"></i>
                </div>
                <div className="table-grid-file__t rem-one" onClick={() => dispatch(setPopupDisplay('none'))}>
                    <i className="fas fa-fw fa-times"></i>
                </div>
            </div> 
        )
    }    
}

export default Popup;