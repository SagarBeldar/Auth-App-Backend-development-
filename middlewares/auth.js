
const jwt=require('jsonwebtoken');
require('dotenv').config;

exports.auth=(req,res,next)=>{

    try {
        //extract jwt token
        const token=req.body.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token Missing"
            });
        }
        // verify the token
        try {
            const payload=jwt.verify(token,process.env.JWT_SECRET);
            console.log(payload);
            

            req.user=payload;
            console.log(req.user);
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:"token is invalid"
            });
        }
        next();      
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Something went wrong ,while verifying the token",
        });
    }
}

 exports.isStudent=(req,res,next)=>{
    try {
         if(req.user.role!=="Student"){
            res.status(401).json({
                success:false,
                message:"This is protected routes for students"
            });
         }
         next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role not matching",
        });
    }
   
 }

 exports.isAdmin=(req,res,next)=>{
    try {
        if(req.user.role!=="Admin"){
           res.status(401).json({
               success:false,
               message:"This is protected routes for Admin"
           });
        }
        next();
   } catch (error) {
       return res.status(500).json({
           success:false,
           message:"User role not matching",
       });
   }
  
 }