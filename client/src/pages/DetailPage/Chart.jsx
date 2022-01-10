import React from 'react'
import { Line } from 'react-chartjs-2'
import { useSelector } from 'react-redux'

const Chart = () => {

    const file = useSelector(state => state.files.file)
    
    const obj = file.clicksDate.reduce(
    (acc, rec) => {
        return (typeof acc[rec] !== 'undefined') ? { ...acc,
        [rec]: acc[rec] + 1
        } : { ...acc,
        [rec]: 1
        }
    }, {}
    )
    const newArr = Object.keys(obj).map((key) => ({
    [key]: obj[key]
    }))

    var labelsMass = []
    var labelMass = []

    newArr.map((key) => {
        labelsMass.push(Object.keys(key))
        Object.values(key).map(xyz => labelMass.push(xyz))
        return true
    })

    const data = {
        labels: labelsMass,
        datasets: [
          {
            label: 'Clicks on generated link',
            data: labelMass,
            fill: false,
            backgroundColor: 'rgb(241, 224, 90)',
            borderColor: 'rgba(241, 224, 90, 0.2)',
          },
        ],
    }
      
    const options = {
    }

    return (
        <Line 
            data={data}
            options={options} />
    )
}

export default Chart
