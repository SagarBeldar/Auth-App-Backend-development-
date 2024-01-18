const express = require('express');
const router = express.Router();


const { login, signup } = require('../controller/Auth');
const { auth, isStudent, isAdmin } = require("../middlewares/auth");

router.post("/login", login);
router.post("/signup", signup);
  
  console.log("Function are try to authenticate the user");

// testing routes
router.get("/test",auth,(req,res)=>{
    res.json({ 
        success:true,
        message:'Welcome to the Protected route for Tests'
     });
});

//Protected routes
//(path,middlewares and handlers/Actions)
router.get("/student", auth, isStudent, (req, res) => {
 res.json({
    success:true,
    message:'Welcome to the Protected route for students'
 });
});

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
       success:true,
       message:'Welcome to the Protected route for admin'
    });
   });

module.exports = router;
