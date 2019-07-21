const userModel = require('../models/userModel')
const {
    compare
} = require('../helpers/bcryptjs')
const {
    sign
} = require('../helpers/jwtoken')
const {
    OAuth2Client
} = require('google-auth-library');

class userController {
    static findAll(req, res, next) {
        userModel
            .find()
            .populate('follower', 'username email')
            .populate('following', 'username email')
            .then(allUser => {
                res.json(allUser)
            })
            .catch(next)
    }

    static findById(req, res, next) {
        let userId = req.params.userId

        userModel
            .findById(userId)
            // .populate('follower')
            // .populate('following')
            .then(user => {
                console.log(user)
                res.json(user)
            })
            .catch(next)
    }

    static signIn(req, res, next) {
        let ue = req.body.ue
        let password = req.body.password
        let searched = {}

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(ue)) {
            searched.email = ue
        } else {
            searched.username = ue
        }
        console.log('sampaisini')
        userModel
            .findOne(searched)
            .then(userFound => {
                if (!userFound) {
                    throw ({
                        code: 404,
                        message: `Invalid username / password`
                    })
                } else {
                    if (!compare(password, userFound.password)) {
                        throw ({
                            code: 404,
                            message: `Invalid username / password`
                        })
                    } else {
                        let {
                            follower,
                            following,
                            _id,
                            username,
                            email,
                            avatar,
                        } = userFound
                        let payload = {
                            follower,
                            following,
                            _id,
                            username,
                            email,
                            avatar
                        }
                        let token = sign(payload)
                        res.json(token)
                    }
                }

            })
            .catch(next)

    }

    static signUp(req, res, next) {
        let {
            username,
            email,
            password
        } = req.body
        let newUser = {
            username,
            email,
            password,
            avatar: `https://api.adorable.io/avatars/213/${username}.png`
        }
        console.log(newUser)
        userModel
            .create(newUser)
            .then(createdUser => {
                console.log('berhasil create')
                res.status(200).json(createdUser)
            })
            .catch(next)
    }

    static follow(req, res, next) {

        let targetId = req.body.targetId
        let userId = req.logedUser._id
        let success = {}

        userModel
            .findOne(userId)
            .then(foundUser => {
                if (foundUser.following.includes(targetId)) {
                    throw ({
                        code: 400,
                        message: `Cannot follow same user`
                    })
                } else {
                    return userModel
                        .findByIdAndUpdate(userId, {
                            $push: {
                                following: targetId
                            }
                        }, {
                            new: true
                        })
                }
            })

            .then((followingUser) => {
                success.user = followingUser
                return userModel
                    .findByIdAndUpdate(targetId, {
                        $push: {
                            follower: userId
                        }
                    }, {
                        new: true
                    })
            })
            .then((followedUser) => {
                success.target = followedUser
                res.json(success)
            })
            .catch(next)
    }

    static unfollow(req, res, next) {
        let targetId = req.body.targetId
        let userId = req.logedUser._id
        let success = {}

        userModel
            .findByIdAndUpdate(userId, {
                $pull: {
                    following: targetId
                }
            }, {
                new: true
            })
            .then(unfollowingUser => {
                success.user = unfollowingUser
                return userModel
                    .findByIdAndUpdate(targetId, {
                        $pull: {
                            follower: userId
                        }
                    }, {
                        new: true
                    })
            })
            .then(unfollowedUser => {
                success.target = unfollowedUser
                res.json(success)
            })
    }

    static checkfollow(req, res, next) {
        console.log('checked')
        let targetId = req.body.targetId
        let userId = req.logedUser._id

        // console.log(targetId, userId)
        userModel
            .findById(userId)
            .then(loggedUser => {
                console.log(loggedUser, 'ini user yang sedang login')
                if (loggedUser.following.includes(targetId)) {
                    res.json({
                        checked: true
                    })
                } else {
                    res.json({
                        checked: false
                    })
                }
            })
            .catch(next)
    }

    static googleSignIn(req, res, next) {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        let token
        let payloadpayload
        console.log('tapi masuk sini')
        client.verifyIdToken({
                idToken: req.body.idToken,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            .then((ticket) => {
                console.log('pertama')
                let payload = ticket.getPayload()
                let myPayload = {
                    email: payload.email,
                    username: payload.name,
                    avatar: payload.given_name
                }
                token = sign(myPayload)
                payloadpayload = myPayload
                return userModel
                    .findOne({
                        email: payload.email
                    })
            })
            .then((foundUser) => {
                if (foundUser) {
                    console.log('ketigaa')
                    res.status(200).json(token)
                } else if (foundUser === null) {
                    console.log('keempoat',payloadpayload)
                    let newUser = {
                        username: payloadpayload.avatar,
                        email: payloadpayload.email,
                        password: 123456,
                    }
                    console.log('hmmm setelah new user')
                    console.log(newUser,'ini new User')
                    return userModel
                        .create(newUser)
                }
            })
            .then((second) => {
                console.log('berhasil bikin');

                res.status(200).json({
                    token
                })
            })
            .catch(next)
    }
    static whoami(req, res, next) {
        console.log('hehehee')
        let userId = req.logedUser._id

        userModel
            .findById(userId)
            .then(user => {
                let sendToClient = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    avatar: user.avatar,
                    following: user.following,
                    follower: user.follower
                }
                console.log(sendToClient)
                res.json(sendToClient)
            })
            .catch(next)
    }
}

module.exports = userController