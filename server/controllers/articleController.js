const articleModel = require('../models/articleModel')

class ArticleController {
    static create(req, res, next) {
        let {
            title,
            content,
            image
        } = req.body
        let newArticle = {
            title,
            content,
            author: req.logedUser._id,
            image: image || 'https://images.unsplash.com/photo-1560787139-1394d216a73e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=720&ixlib=rb-1.2.1&q=80&w=1080'
        }
        articleModel
            .create(newArticle)
            .then(created => {
                res.json(created)
            })
            .catch(next)
    }

    static findAll(req, res, next) {
        articleModel
            .find()
            .then(allArticle => {
                console.log('masup')
                res.json(allArticle)
            })
            .catch(next)
    }

    static search(req, res, next) {
        let articleId = req.query.articleId
        let searched = {}

        if (req.query.articleId) {
            searched._id = req.query.articleId
        }
        if (req.query.userId) {
            searched.author = req.query.userId
        }

        articleModel
            .find(searched)
            // .populate('clapper')
            // .populate('bookmarked')
            // .populate('tags')
            // .populate('author')
            .then(foundArticle => {
                res.json(foundArticle)
            })
            .catch(next)
    }

    static findUsersArticle(req, res, next) {
        let userId = req.logedUser._id

        articleModel
            .find({
                author: userId
            })
            .populate('author')
            .then(userArticle => {
                res.json(userArticle)
            })
            .catch(next)
    }

    static findArticle(req, res, next) {
        let articleId = req.params.articleId

        articleModel
            .findById(articleId)
            .then(article => {
                res.json(article)
            })
    }

    static update(req, res, next) {
        let userId = req.logedUser._id
        let articleId = req.params.articleId
        let updateData = {}
        let {
            title,
            content,
            image,
            status
        } = req.body
        if (title) {
            updateData.title = title
        }
        if (content) {
            updateData.content = content
        }
        if (image) {
            updateData.image = image
        }
        if (status) {
            updateData.status = status
        }

        articleModel
            .findByIdAndUpdate(articleId, updateData, {
                new: true
            })
            .then(updated => {
                res.json(updated)
            })
            .catch(next)
    }

    static delete(req, res, next) {
        let articleId = req.params.articleId

        articleModel
            .findByIdAndDelete(articleId)
            .then(deleted => {
                res.json(deleted)
            })
            .catch(next)
    }

    static bookmark(req, res, next) {
        let articleId = req.params.articleId
        let userId = req.logedUser._id
        
        articleModel
            .findById(articleId)
            .then(article => {
                console.log(article, 'ini article id')
                // res.json(article)
                if (article.bookmarked.includes(userId)) { // jikauser ketemu di boookmarked maka akan di pull
                    return articleModel
                        .findByIdAndUpdate(articleId, {
                            $pull: {
                                bookmarked: userId
                            }
                        }, {
                            new: true
                        })
                } else {
                    return articleModel
                        .findByIdAndUpdate(articleId, {
                            $push: {
                                bookmarked: userId
                            }
                        }, {
                            new: true
                        })
                }
            })
            .then(updated => {
                res.json(updated)
            })
            .catch(next)
    }

    static clap(req, res, next) {
        let articleId = req.params.articleId
        let userId = req.logedUser._id

        articleModel
            .findById(articleId)
            .then(article => {
                console.log(article, 'ini article id')
                // res.json(article)
                if (article.clapper.includes(userId)) { // jikauser ketemu di boookmarked maka akan di pull
                    return articleModel
                        .findByIdAndUpdate(articleId, {
                            $pull: {
                                clapper: userId
                            }
                        }, {
                            new: true
                        })
                } else {
                    return articleModel
                        .findByIdAndUpdate(articleId, {
                            $push: {
                                clapper: userId
                            }
                        }, {
                            new: true
                        })
                }
            })
            .then(updated => {
                res.json(updated)
            })
            .catch(next)
    }

    // belum lengkap, masih ahrus di cek tag yang unique
    static tag(req, res, next) {
        let articleId = req.params.articleId
        // let userId = req.logedUser._id
        let tags = req.body.tags
        console.log(typeof tags)

        articleModel
            .findById(articleId)
            .then(article => {
                let uniqueTags = []
                
                tags.forEach(tag => {
                    if(article.tags.length !== 0){
                        article.tags.forEach(articletag => {
                            if(tag !== articletag){
                                uniqueTags.push(articletag)
                            }
                        })
                    } else {
                        uniqueTags = tags
                    }
                })
                console.log(uniqueTags)
                return articleModel
                    .findByIdAndUpdate(articleId,{
                        $push: {
                            tags: {
                                $each: uniqueTags
                            }
                        }
                    },{
                        new: true
                    })
            })
            .then(updated => {
                res.json(updated)
            })
            .catch(next)
    }

    static generatePic() {
        // generate random picture from "https://source.unsplash.com/random/1080x720"
    }
}

module.exports = ArticleController