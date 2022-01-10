import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import UploadFile from './UploadFile'
import { hideUploader } from '../../reducers/uploadReducer';

const Uploader = () => {
    const files = useSelector(state => state.upload.files)
    const isVisible = useSelector(state => state.upload.isVisible)
    const dispatch = useDispatch()

    useEffect(() => {
        if(files.length === 0) {
            dispatch(hideUploader())
        } 
    }, [files, dispatch])

    return (
        <div className="download">
            <h3>Uploaded files</h3>
            { isVisible ? files.map(file => <UploadFile key={file.id} file={file}/>) : <p>No files uploaded</p>}
        </div>
    )
}

export default Uploader