const Router = require('express').Router
const userController = require('../controllers/user.controller')
const router = new Router()

router.post('/login', userController.login)
router.get('/check-auth', userController.checkAuth)
router.post('/registration', userController.registration)
router.get('/logout', userController.logout)
router.get('/refresh', userController.refresh)

module.exports = router