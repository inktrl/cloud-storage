const { Router } = require('express')
const router = Router()
const File = require('../models/File')

router.get('', async(req, res) => {
    try {
        res.redirect(`${process.env.CLIENT_URL}/login`)
    } catch (error) {
        res.status(500).json({message: 'Server error...'})
    }
})

router.get('/:code', async(req, res) => {
    try {
        const file = await File.findOne({code: req.params.code})
        if(file) {
            file.clicks++
            file.clicksDate.push(new Date(Date.now()).toLocaleDateString())
            await file.save()
            return res.redirect(`${process.env.CLIENT_URL}/download/${file.code}`)
        }
        res.redirect(`${process.env.CLIENT_URL}/login`)
    } catch (error) {
        res.status(500).json({message: 'Server error...'})
    }
})

module.exports = router