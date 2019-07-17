const router = require('express').Router()
const userController = require('../controllers/userController')
const { authentication, authorization } = require('../middlewares/auth')

router.get('/',userController.findAll) // => to get all user in database
router.get('/:userId',userController.findById) // => get user by id
router.post('/signin', userController.signIn) // => user to sign in
router.post('/signup', userController.signUp) // => user to sign up

router.use('/',authentication)

router.patch('/follow',userController.follow) // => user to follow other user
router.patch('/unfollow',userController.unfollow) // => user to  unfollow other user

module.exports = router