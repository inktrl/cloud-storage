import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { removeUploadFile } from '../../reducers/uploadReducer'

import './UploadFile.scss'

const UploadFile = ({file}) => {
    const dispatch = useDispatch()

    useEffect(() => {
        if(file.progress === 100) {
            dispatch(removeUploadFile(file.id))
        }
    }, [file, dispatch])

    return (
        <div className="uploading-file">
            <div className="uploading-file__header">
                <div className="uploading-file__name">{file.name}</div>
            </div>
            <div className="uploading-file__progress-bar">
                <div className="uploading-file__upload-bar" style={{width: file.progress + "%"}}>
                    <div className="uploading-file__percent">{file.progress}%</div>
                </div>
            </div>
        </div>
    )
}

export default UploadFile;