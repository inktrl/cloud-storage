const userService = require('../services/userService')
const fileService = require('../services/fileService')
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/api-error')
const FileModel = require('../models/File')
const User = require('../models/User')
const UserDto = require('../dtos/user-dto')
const bcrypt = require('bcryptjs')

class UserController {

    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка при валідації', errors.array()))
            }
            const { email, password } = req.body
            const userData = await userService.registration(email, password)
            await fileService.createDir(req, new FileModel({user: userData.user.id, name: ''}))

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'none'})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'none'})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            next(error)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: true, sameSite: 'none'})
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async updateUsername(req, res, next) {
        try {
            console.log('Username [server]: ' + req.body.username + ' | ' + req.body.id)

            const user = await User.findById(req.body.id)
            user.username = req.body.username
            await user.save()
            const userDto = new UserDto(user)
            return res.json(userDto)

        } catch (error) {
            next(error)
        }
    }

    async updateEmail(req, res, next) {
        try {
            console.log('Email [server]: ' + req.body.email + ' | ' + req.body.id)

            const user = await User.findById(req.body.id)
            const checkEmail = await User.findOne({ email: req.body.email})
            if(checkEmail) {
                return ApiError.BadRequest('Email повторюється!')
            }
            user.email = req.body.email
            await user.save()
            const userDto = new UserDto(user)
            return res.json(userDto)

        } catch (error) {
            next(error)
        }
    }

    async updatePassword(req, res, next) {
        try {
            console.log('Password [server]: ' + req.body.password + ' | ' + req.body.id)

            const user = await User.findById(req.body.id)
            const hashPassword = await bcrypt.hash(req.body.password, 3)
            user.password = hashPassword
            await user.save()
            const userDto = new UserDto(user)
            return res.json(userDto)

        } catch (error) {
            next(error)
        }
    }

    async userInfo(req, res, next) {
        try {
            const user = await User.findById(req.body.id)
            const userDto = new UserDto(user)
            return res.json(userDto)
        } catch (error) {
            next(error)
        }
    }
    
}


module.exports = new UserController();