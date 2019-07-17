module.exports = function (err, req, res, next) {
    // if (err.name == 'ValidationError') {
    //     if (err.errors.email) {
    //         if (err.errors.email.reason) {
    //             res.status(404).json(err.errors.email.reason)
    //         } else {
    //             res.status(404).json(err.message)
    //         }
    //     } else {

    //         res.status(404).json(err.message)
    //     }
    // } else if (!err.code) {
    //     if (err.message.includes('Cast to ObjectId failed')) {
    //         res.status(404).json({
    //             message: 'Bad request'
    //         })
    //     } else {
    //         res.status(500).json({
    //             message: 'Internal server error'
    //         })
    //     }
    // } else {
    //     if (err.name == 'MongoError') {
    //         res.status(500).json({
    //             message: err.errmsg
    //         })
    //     } else {
    //         res.status(err.code).json({
    //             message: err.message
    //         })
    //     }
    // }
    res.json(err)
}