import React from 'react'

import { useSelector, useDispatch } from 'react-redux'
import FileElement from './FileElement/FileElement'
import Popup from './Popup'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import FileService from '../../services/FileService'

import $ from 'jquery'

const Fileslist = () => {
    const dispatch = useDispatch()
    const files = useSelector(state => state.files.files)
    const fileView = useSelector(state => state.files.view)
    const currentDir = useSelector(state => state.files.currentDir)

    function fileSort(key) {
        switch (key) {
            case 'name':
                $("#date-i").removeClass("n").addClass("none")
                $("#size-i").removeClass("n").addClass("none")
                if($("#name-i").hasClass("n")) {
                    $("#name-i").toggleClass("fa-chevron-down").toggleClass("fa-chevron-up")
                    if($("#name-i").hasClass("fa-chevron-up")) {
                        dispatch(FileService.getFiles(currentDir, 'name'))
                    }
                    if($("#name-i").hasClass("fa-chevron-down")) {
                        dispatch(FileService.getFiles(currentDir, '-name'))
                    }
                } else {
                    $("#name-i").removeClass("none").addClass("n")
                    dispatch(FileService.getFiles(currentDir, '-name'))
                }
                $("#date-i").removeClass("fa-chevron-up").addClass("fa-chevron-down")
                $("#size-i").removeClass("fa-chevron-up").addClass("fa-chevron-down")
                break;

            case 'date':
                $("#name-i").removeClass("n").addClass("none")
                $("#size-i").removeClass("n").addClass("none")
                if($("#date-i").hasClass("n")) {
                    $("#date-i").toggleClass("fa-chevron-down").toggleClass("fa-chevron-up")
                    if($("#date-i").hasClass("fa-chevron-up")) {
                        dispatch(FileService.getFiles(currentDir, 'date'))
                    }
                    if($("#date-i").hasClass("fa-chevron-down")) {
                        dispatch(FileService.getFiles(currentDir, '-date'))
                    }
                } else {
                    $("#date-i").removeClass("none").addClass("n")
                    dispatch(FileService.getFiles(currentDir, '-date'))
                }
                $("#name-i").removeClass("fa-chevron-up").addClass("fa-chevron-down")
                $("#size-i").removeClass("fa-chevron-up").addClass("fa-chevron-down")
                break;

            case 'size':
                $("#name-i").removeClass("n").addClass("none")
                $("#date-i").removeClass("n").addClass("none")
                if($("#size-i").hasClass("n")) {
                    $("#size-i").toggleClass("fa-chevron-down").toggleClass("fa-chevron-up")
                    if($("#size-i").hasClass("fa-chevron-up")) {
                        dispatch(FileService.getFiles(currentDir, 'size'))
                    }
                    if($("#size-i").hasClass("fa-chevron-down")) {
                        dispatch(FileService.getFiles(currentDir, '-size'))
                    }
                } else {
                    $("#size-i").removeClass("none").addClass("n")
                    dispatch(FileService.getFiles(currentDir, '-size'))
                }
                $("#name-i").removeClass("fa-chevron-up").addClass("fa-chevron-down")
                $("#date-i").removeClass("fa-chevron-up").addClass("fa-chevron-down")
                break;
            default:
                break;
        }
    }

    if(fileView === 'fa-th-large') {
        return (
            <TransitionGroup className="fileplate">
                {files.map((file, index) => 
                    <CSSTransition 
                        key={index}
                        timeout={500}
                        classNames={'file'}
                        exit={false}
                    >
                        <FileElement file={file}/>
                    </CSSTransition>
                )}
                <Popup />
            </TransitionGroup>
        )
    } else {
        return (
            <div className="table__body">
                <div className="table-grid-file">
                    <div className="table-grid-file__header">
                        <div className="table-grid-file__name" onClick={() => fileSort('name')} title="Sort by name">
                            Name
                            <i id="name-i" className="fas fa-chevron-down n"></i>
                        </div>
                        <div className="table-grid-file__date" onClick={() => fileSort('date')} title="Sort by date">    
                            Date 
                            <i id="date-i" className="fas fa-chevron-down none"></i>
                        </div>
                        <div className="table-grid-file__size" onClick={() => fileSort('size')} title="Sort by size">
                            Size
                            <i id="size-i" className="fas fa-chevron-down none"></i>
                        </div>
                    </div>
                    
                    <TransitionGroup>
                        {files.map((file, index) => 
                            <CSSTransition 
                                key={index}
                                timeout={500}
                                classNames={'file'}
                                exit={false}
                            >
                                <FileElement file={file}/>
                            </CSSTransition>
                        )}
                        <Popup />
                    </TransitionGroup>
                </div>
            </div>
        )
    }
}

export default Fileslist
