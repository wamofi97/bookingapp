import User from "../models/User.js"
import bcrypt from "bcrypt"
import  { createError } from "../utils/error.js"
import jwt from "jsonwebtoken"

export const register = async (req,res,next)=>{
    const {username, email, password} = req.body
    try {
        const salt = await bcrypt.genSaltSync(10)
        const hashedPassword =  await bcrypt.hash(password, salt)

        const newUser = await new User({
            username,
            email,
            password: hashedPassword
        }).save()
        res.status(200).json({
            message: "User has been created.",
            user: newUser   
        })
    } catch (error) {
        next(error)
    }
}

export const login = async (req,res,next)=>{
    const {username, password} = req.body
    try {
        const user = await User.findOne({username})
        if(!user) return next(createError(404, "User not found!"))

        const isValidPassword = await bcrypt.compare(password, user.password)
        if(!isValidPassword) return next(createError(400, "Wrong password or username!"))
        
        const token = jwt.sign({id:user._id, isAdmin: user.isAdmin}, process.env.JWT_SECRET)

        const {password: _, isAdmin, ...otherDetails} = user._doc;
        res.cookie("access_token", token,{
            httpOnly:true
            })
            .status(200)
            .json({...otherDetails})
    } catch (error) {
        next(error)
    }
}