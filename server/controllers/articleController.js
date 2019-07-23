const articleModel = require('../models/articleModel')
const axios = require('axios')

class ArticleController {
    static create(req, res, next) {
        console.log('article create')
        console.log(req.body, 'ini reqbody')
        console.log(req.file, 'ini reqfile')
        let {
            title,
            content,
            tags,
            status
        } = req.body
        let cloudStoragePublicUrl = ''
        if (req.file) {
            cloudStoragePublicUrl = req.file.cloudStoragePublicUrl
        }
        tags = tags.split(',')
        tags = [...new Set(tags)]

        let newArticle = {
            title,
            content,
            author: req.logedUser._id,
            image: cloudStoragePublicUrl || 'https://images.unsplash.com/photo-1560787139-1394d216a73e?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=720&ixlib=rb-1.2.1&q=80&w=1080',
            tags,
            status
        }

        articleModel
            .create(newArticle)
            .then(created => {
                console.log('berhasil', created)
                res.json(created)
            })
            .catch(next)
    }

    static findAll(req, res, next) {
        articleModel
            .find({
                status: 'Published'
            })
            .populate('author', 'avatar _id username email')
            .then(allArticle => {
                console.log('masup')
                res.json(allArticle)
            })
            .catch(next)
    }

    static search(req, res, next) {
        let query = req.query.hints.toLowerCase()

        articleModel
            .find({
                title: {
                    $regex: new RegExp(`.*${query}.*`, "i")
                },
                status: 'Published'
            })
            // .populate('clapper')
            // .populate('bookmarked')
            // .populate('tags')
            .populate('author', 'username')
            .then(found => {
                console.log(found)
                res.json(found)
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
        console.log('lagi update');

        let userId = req.logedUser._id
        let articleId = req.params.articleId
        let updateData = {}
        let {
            title,
            content,
            image,
            status
        } = req.body
        // let cloudStoragePublicUrl = ''
        if (req.file) {
            updateData.image = req.file.cloudStoragePublicUrl
        }
        if (title) {
            updateData.title = title
        }
        if (content) {
            updateData.content = content
        }
        // if (image) {
        //     updateData.image = image
        // }
        if (status) {
            updateData.status = status
        }
        console.log(updateData, '=-=-=-=-=-=-=-')
        articleModel
            .findByIdAndUpdate(articleId, updateData, {
                new: true
            })
            .then(updated => {
                console.log(updated, 'ini updated loh yaaaa')
                console.log(updated.image);

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
                        .populate('author', '_id username email avatar')
                } else {
                    return articleModel
                        .findByIdAndUpdate(articleId, {
                            $push: {
                                bookmarked: userId
                            }
                        }, {
                            new: true
                        })
                        .populate('author', '_id username email avatar')
                }
            })
            .then(updated => {
                if (updated.bookmarked.includes(userId)) {
                    res.json({
                        data: updated,
                        message: 'Bookmarked'
                    })
                } else {
                    res.json({
                        data: updated,
                        message: 'Unbookmarked'
                    })
                }
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
                        .populate('author', '_id username email avatar')
                } else {
                    return articleModel
                        .findByIdAndUpdate(articleId, {
                            $push: {
                                clapper: userId
                            }
                        }, {
                            new: true
                        })
                        .populate('author', '_id username email avatar')
                }
            })
            .then(updated => {
                console.log(updated)
                if (updated.clapper.includes(userId)) {
                    res.json({
                        data: updated,
                        message: 'Claped'
                    })
                } else {
                    res.json({
                        data: updated,
                        message: 'Unclaped'
                    })
                }
            })
            .catch(next)
    }

    // belum lengkap, masih ahrus di cek tag yang unique
    static tag(req, res, next) {
        let articleId = req.params.articleId
        let tags = req.body.tags.split(',')
        tags = [...new Set(tags)]

        articleModel
            .findByIdAndUpdate(articleId, {
                $push: {
                    tags: {
                        $each: uniqueTags
                    }
                }
            }, {
                new: true
            })
            .then(updated => {
                res.json(updated)
            })
            .catch(next)
    }

    static searchByTag(req, res, next) {
        let tag = req.query.tag
        console.log(tag)

        articleModel
            .find({
                tags: {
                    $in: tag
                }
            })
            // ,populate('author','avatar email username _id')
            .populate('author', 'avatar _id username email')
            .then(foundArticle => {
                console.log(foundArticle)
                res.json(foundArticle)
            })
            .catch(next)
    }

    static generatePic() {
        // generate random picture from "https://source.unsplash.com/random/1080x720"
        // axios.get()
    }
    static getNews(req, res, next) {
        axios({
                url: `https://newsapi.org/v2/top-headlines?country=id&apiKey=${process.env.NEWS_API_KEY}`,
                method: 'GET'
            })
            .then(({
                data
            }) => {
                // console.log(data)
                let news = []
                for (let i = 0; i < 10; i++) {
                    // console.log(data[i])
                    news.push(data.articles[i])
                }
                res.json(news)
            })
            .catch(next)
    }
}

module.exports = ArticleController