const bcrypt = require('bcrypt');
// const user = require('../models/User');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require("dotenv").config;

//signup route handler

exports.signup = async (req, res) => {
    try {
        //get data/req. fetch from body
        const { name, email, password, role } = req.body;

        //check if user already exist
        const existingUser = await User.findOne({ email });
 
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exit',
            });
        }
        //password secure
        let hashedpassword;
        try {
            hashedpassword = await bcrypt.hash(password, 10);    //hash function secure (the pass., and round)
            // has func. =>two arguments(value,no. of round)
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing Password'
            });
        } 

        //here user can create entry
        const user = await User.create({
            name, email, password: hashedpassword, role
        })

        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannont be registerd,please try again later'
        });
    }
}


//login handler 

exports.login = async (req, res) => {
    try {

        //get data
        const { email, password } = req.body;
        //If not registered user
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill the details carefully"
            });
        }
        //check for registered user
        const user = await User.findOne({ email });
        //if nat a registered user
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered"
            });
        }
        //compare password
        let payload = {
            email: user.email,
            id: user._id, 
            role: user.role,
        };
        //verify the password and generate JWT token
        if (await bcrypt.compare(password, user.password)) {
            //Password Match //here we create token
            let token = jwt.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                });   //sign(payload,token)

            user.toObject();
            user.token = token;
            user.password = undefined; //password removed from user object not from database

            const options={
                expires:new Date(Date.now()+3*24*60*60*10000),
                httpOnly:true,
            };
            res.cookie("sagar",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged in successfully"
            });
        }
        else {
            //password do not match
            return res.status(403).json({
                success: false,
                message: "Password Incorrect"
            });
        }

    }
    catch (error) {
      console.log(error);
      return res.status(500).json({ 
        success:false,
        message:"Login Failure",
      });
    }
}
