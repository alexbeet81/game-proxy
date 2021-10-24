const User = require('../models/user')
const jwt = require('jsonwebtoken');
var HttpStatus = require('http-status-codes');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
        const userId = decodedToken.userId;

        await User.findOne({_id: userId}, (err, user) => {
            if(err) {
                throw err
            }
            if(!user) {
                throw 'Invalid user ID'
            } else {
                next()
            }
        })
    } catch (err) {
        res.status(HttpStatus.StatusCodes.FORBIDDEN).json({
            error: 'Unauthorized',
            message: 'Only registered user can access that route'
        });
    }
};