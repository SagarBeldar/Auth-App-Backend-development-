const mongoose=require('mongoose');
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        trim:true, 
    },
 
    email:{
      type:String, 
      required:true,
      trim:true,
    }, 
  
    password:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        enum:["Admin","Student","Visitor"]
    }

});

module.exports=mongoose.model("user",UserSchema)