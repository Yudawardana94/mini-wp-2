const mongoose = require('mongoose')
const Schema = mongoose.Schema

let articleSchema = new Schema({
    title: {
        type: String,
        required: [true, `Please input a tittle`]
    },
    content: {
        type: String
    },
    clapper: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    bookmarked: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    tags: [{
        type: String,
        default: []
    }],
    author: {
        type: String,
        ref: 'User'
    },
    status: {
        type: String,
        default: 'Unpublished'
    },
    image: {
        type: String,
        default: 'https://source.unsplash.com/random/1080×720'
    }
},{
    timestamps: true
})

let Article = mongoose.model ('Article',articleSchema)

module.exports = Article