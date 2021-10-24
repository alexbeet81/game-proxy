const HttpStatus = require('http-status-codes');
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user');

exports.register = (req, res, next) => {
    User.findOne({email: req.body.email}, async (err, doc) => {
        if(err) throw err
        if(doc) res.send('User already exists')
        if(!doc) {
            await bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if(err) throw err
                if(hash) {
                    const newUser = new User({
                        email: req.body.email,
                        password: hash
                    })
        
                    await newUser.save().then(user => {
                        console.log(user)
                        res.send('User created')
                    })
                    // Store hash in your password DB.
                }
            });
        }
        
    })
}
exports.login = (req, response, next) => {
    User.findOne({ email: req.body.email }, async (err, user) => {
        if (!user) {
            console.log('here')
            response.status(HttpStatus.StatusCodes.BAD_REQUEST).json({ error: 'User or password is incorrect' });
            return
        }
        bcrypt.compare(req.body.password, user.password , function(err, res) {
            if (err){
              // handle error
              response.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
              return
            }
            if (res) {
                // Send JWT
                response.status(HttpStatus.StatusCodes.OK).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.JWT_TOKEN_SECRET,
                        { expiresIn: '24h' }
                    )
                });
            } else {
                // password incorrect
                response.status(HttpStatus.StatusCodes.UNAUTHORIZED).json({ error: 'User or password is incorrect' });
            }
        });
    })
};