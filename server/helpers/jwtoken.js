const jwtoken = require('jsonwebtoken')

module.exports = {
    sign: function (val) {
        let token = jwtoken.sign(val, process.env.JWT_SECRET)
        return token
    },
    verify: function (val) {
        try {
            return jwtoken.verify(val, process.env.JWT_SECRET)
        } catch {
            throw ({
                code: 401,
                message: `Invalid token Secret`
            })
        }
    }
}