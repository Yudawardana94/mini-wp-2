const { sign, verify } = require('../helpers/jwtoken')
const userModel = require('../models/userModel')
const articleModel = require('../models/articleModel')

module.exports = {
    authentication: function (req, res, next) {
        // console.log('hehehe dari authentication')
        let token = req.headers.token
        console.log(token, 'ini dari auth lohh')
        if (!token) {
            res.status(400).json ({
                code: 400,
                message: `Unauthenticated`,
                source: 'Authenticaiton Error'
            })
        } else {
            let decode = verify(token)
            console.log(decode,'][][[][][][][][][][][][][')
            userModel
                .findOne({
                    email: decode.email
                })
                .then((found) => {
                    console.log(found,'=-==-=-=-==-=-=-=-')
                    let decode = verify(token)
                    req.decode = decode
                    req.logedUser = found
                    next()
                })
                .catch((err) => {
                    res.status(404).json ({
                        code: 404,
                        message: `User not found`,
                        source: 'Authenticaiton Error'
                    })
                })
        }
    },
    authorization: function (req, res, next) {
        let loggedUser = req.logedUser._id
        let article = req.params.articleId

        articleModel
            .findById(article)
            .then(article => {
                if(article.author === loggedUser.toString()){
                    next()
                }
                else {
                    console.log('unauthorization')
                    res.status(401).json ({
                        code: 401,
                        message: `Unauthorized`,
                        source: 'Authorization Error'
                    })
                }
            })
            .catch(err =>{
                res.status(401).json ({
                    code: 401,
                    message: `Unauthorized`,
                    source: 'Authorization Error'
                })
            })
    }
}