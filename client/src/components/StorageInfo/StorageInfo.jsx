import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Uploader from '../Uploader/Uploader'

const StorageInfo = () => {
    const diskSpace = useSelector(state => state.user.currentUser.diskSpace)
    const usedSpace = useSelector(state => state.user.currentUser.usedSpace)
    const [space, setSpace] = useState(0)

    useEffect(() => {
        setSpace(Math.round(usedSpace / diskSpace * 100))
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [])

    return (
        <div className="col-3">
            <div className="free-space">
                <div className="free-space__header">
                    <h3>Free space</h3>
                </div>
                <div className="free-space__body">
                    <div className="free-space__loader">
                        <div className="free-space__load" style={{ width: `${space}%` }}></div>
                    </div>
                    <ul>
                        <li>
                            <div className="li-circle-color yellow"></div>
                            <span>Used space</span>
                            <div className="li-interest">{space}%</div>
                        </li>
                        <li>
                            <div className="li-circle-color orange"></div>
                            <span>Free space</span>
                            <div className="li-interest">{100 - space}%</div>
                        </li>
                    </ul>
                </div>
            </div>
            <hr />
            <div>
                <h3>Site info</h3>
                <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis dignissimos maxime dicta, consequuntur magnam repudiandae labore officiis laborum nemo fugiat quaerat! Magnam hic laudantium autem architecto, aperiam deleniti quis inventore?
                </p>
            </div>
            <hr />
            <Uploader/>
        </div>
    )
}

export default StorageInfo
