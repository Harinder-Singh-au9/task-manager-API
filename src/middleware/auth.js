const User = require("../models/user")
const jwt = require("jsonwebtoken")
const auth = async (req, res, next) => {
    try {
        // console.log("Start")
        const token = req.header('Authorization').replace("Bearer ", "")
        // console.log("token 5 ",token)
        const decode = jwt.verify(token, process.env.JWT_SECRET)
        // console.log("matched?? = ",decode)
        const user = await User.findOne({ _id: decode._id, "tokens.token": token })
        // console.log(user)
        if (!user) {
            throw new Error ("fail")     
        }
        req.token = token
        req.user = user
        // console.log(user)

        next()
    } catch (error) {
        res.status(401).send("Not Authorised")
    }
}

module.exports = auth