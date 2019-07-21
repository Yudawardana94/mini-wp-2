const router = require('express').Router()
const articleController = require('../controllers/articleController')
const { authentication, authorization } = require('../middlewares/auth')
const { multer, UploadToGCS } = require('../middlewares/upload')

// router.get('/getpicture',articleController.generatePic)
router.get('/', articleController.findAll)
router.get('/search', articleController.search) //search by article id // untuk menembak kesini gunakan localhost:3000/articles/search?articleId={{ article id }}

router.use('/', authentication)

router.post('/',multer.single('image'),UploadToGCS, articleController.create)
router.get('/logedUser', articleController.findUsersArticle)
router.patch('/bookmark/:articleId', articleController.bookmark)
router.patch('/clap/:articleId', articleController.clap)
router.patch('/tag/:articleId', articleController.tag)
router.get('/:articleId', articleController.findArticle)

router.patch('/:articleId', authorization, articleController.update)
router.delete('/:articleId', authorization, articleController.delete)

module.exports = router