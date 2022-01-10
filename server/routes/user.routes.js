const Router = require('express').Router
const userController = require('../controllers/userController')
const router = new Router()
const {body} = require('express-validator')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.get('/activate/:link', userController.activate)
router.get('/refresh', userController.refresh)

router.post('/user/username', authMiddleware, userController.updateUsername)
router.post('/user/email', authMiddleware, userController.updateEmail)
router.post('/user/password', authMiddleware, userController.updatePassword)

router.post('/user/info', authMiddleware, userController.userInfo)

module.exports = router