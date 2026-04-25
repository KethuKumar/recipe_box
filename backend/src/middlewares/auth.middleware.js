

import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js'
import config from '../config/config.js'


const protect = async(req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return res.status(401).json({
                message:"not authorized"
            })
        }
        const decoded = jwt.verify(token, config.JWT_SECRET)

        const user = await userModel.findById(decoded.id).select("-password")

        req.user = user

        next();

    } catch (error) {
        return res.status(401).json({
            message:"invalid token",
            error:error.message
        })
    }
}

export default protect