const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization
        &&
        req.headers.authorization.startsWith("Bearer")) {

            try{
  
                token = req.headers.authorization.split(" ")[1]
                const decoded = jwt.verify(token, process.env.JWT_SECRET)  
                req.user = await User.findById(decoded.id)
                next()
            }catch (err){
                res.status(401)
                throw new Error({message: 'Authorization failed', error: err.message})
            }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
      }
})

module.exports = protect