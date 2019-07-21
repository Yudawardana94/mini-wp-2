const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hash } = require('../helpers/bcryptjs')
const lib = 'abcdefghijklmonpqrstuvwxyz'
let name = ''
for (let i = 0; i < 6; i++) {
    name += lib[Math.floor(Math.random()*lib.length-1)]
}
let userSchema = new Schema({
    username: {
        type: String,
        required: [true, `Input Username`]
    },
    email: {
        type: String,
        required: [true, `Input Email`],
        validate: [{
            validator: function (val) {
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
                    throw ('Invalid Format Email')
                }
            },
            validator: function (val) {
                return new Promise((res, rej) => {
                    User.findOne({
                            email: val
                        })
                        .then(found => {
                            if (found) {
                                res(false)
                            } else {
                                res(true)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
            },
            message: `Email has been used`
        }]
    },
    password: {
        type: String,
        required: [true, `Input Password`],
        minlength: [5, `Password mut be 5 character or greater`]
    },
    avatar: {
        type: String,
        default: `https://api.adorable.io/avatars/213/${name}.png`
    },
    follower: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }]
},{
    timestamps: true
})

userSchema.pre('save', function (next) {
    this.password = hash(this.password)
    next()
})

let User = mongoose.model('User', userSchema)

module.exports = User