import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pushToStack, setCurrentDir, setFile } from '../../../reducers/fileReducer'
import { useHistory } from 'react-router-dom'
import FileService from '../../../services/FileService'
import sizeFormat from '../../../assets/js/sizeFormat'
import getFileTypeIcon from '../../../utilities/getFileTypeIcon'
import Loader from '../../Loader/Loader'
import { useFetching } from '../../../hooks/fetching.hook'
import $ from 'jquery'

const Fileelement = ({file}) => {
    const dispatch = useDispatch()
    const history = useHistory()
    const currentDir = useSelector(state => state.files.currentDir)
    const fileView = useSelector(state => state.files.view)

    const [check, setCheck] = useState('fa-link')

    const [fetchDownloadFile, isDownloadFileLoading] = useFetching(async () => {
        await dispatch(FileService.downloadFile(file))
    })

    const [fetchDeleteFile, isDeleteFileLoading] = useFetching(async () => {
        await dispatch(FileService.deleteFile(file))
    })

    function openDirHandler(e) {
        e.stopPropagation()
        if(file.type === 'dir') {
            dispatch(pushToStack([{id: currentDir, path: file.path}]))
            dispatch(setCurrentDir(file._id))
        } else {
            dispatch(setFile(file))
            history.push(`/detail`)
        }
    }

    function downloadClickHandler(e) {
        e.stopPropagation()
        if(!isDownloadFileLoading) {
            fetchDownloadFile()
        }
    }

    function copyToClipboard(element) {
        element.stopPropagation()
        var $temp = $("<input>")
        $("body").append($temp)
        $temp.val(file.urlLink).select()

        document.execCommand("copy")
        if(check === 'fa-link') {
            setCheck("fa-check")
            setTimeout(() => {
                setCheck("fa-link")
            }, 1500)
        }

        $temp.remove()
    }

    function deleteClickHandler(e) {
        e.stopPropagation()
        fetchDeleteFile()
    }


    if(fileView === 'fa-th-large') {
        return (
            <div className="file-plate" key={file.id} onClick={(e) => openDirHandler(e)}>
                {(isDownloadFileLoading || isDeleteFileLoading) && <Loader />}
                <div className="file-plate__q">
                    <i className={getFileTypeIcon(file.type)}></i>
                </div>
                <div className="file-plate__w">
                    {file.name}
                </div>
                <div className="file-plate__e">
                    {file.type !== 'dir' && <span onClick={(e) => copyToClipboard(e)} className="fal fa-fw fa-link file__link" title="Copy Link"> </span>}
                    {file.type !== 'dir' && <span onClick={(e) => downloadClickHandler(e)} className={`fal fa-fw ${isDownloadFileLoading ? 'fa-spinner' : 'fa-download'} file__download`}> </span>}
                    <span onClick={(e) => deleteClickHandler(e)} className="fal fa-fw fa-trash file__delete"> </span>
                </div>
            </div>
        )
    } else {
        return (
            <div className="table-grid-file__body" key={file.id} onClick={(e) => openDirHandler(e)}>
                {isDownloadFileLoading && <Loader />}
                <div className="table-grid-file__q">
                    <i className={getFileTypeIcon(file.type)}></i>
                </div>
                <div className="table-grid-file__w">
                    <span>{file.name}</span>
                    <i className="fal fa-fw fa-pencil file__rename" title="Rename"></i>
                </div>
                <div className="table-grid-file__e">
                    {file.type !== 'dir' && <span onClick={(e) => copyToClipboard(e)} className={`fal fa-fw ${check} file__link`} title="Copy Link"></span>}
                    {file.type !== 'dir' && <span onClick={(e) => downloadClickHandler(e)} className={`fal fa-fw ${isDownloadFileLoading ? 'fa-spinner' : 'fa-download'} file__download`} title="Download"> </span>}
                    <span onClick={(e) => deleteClickHandler(e)} className="fal fa-fw fa-trash file__delete" title="Delete"> </span>
                </div>
                <div className="table-grid-file__r">{new Date(file.date).toLocaleDateString()}</div>
                <div className="table-grid-file__t">{sizeFormat(file.size)}</div>
            </div>
        )
    }
}

export default Fileelement