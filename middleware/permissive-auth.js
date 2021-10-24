const jwt = require('jsonwebtoken');
const User = require('../models/user')

module.exports = (req, res, next) => {
  try {
    const token = req.query.token;
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    const userId = decodedToken.userId;

    User.findOne({_id: userId}, (err, user) => {
        if (err) throw err
        if (!user) {
          throw 'There was a problem';
        } else {
            req.allowed = true;
        }
    })
  } catch (err) {
    req.allowed = false;
  }
  
  next();
};