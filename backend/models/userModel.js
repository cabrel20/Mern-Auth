const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");



const Schema = mongoose.Schema

const userSchema = new Schema({
     email:{type:String,required:true, unique:true},
     password:{type:String, required:true}
})


// static method signup

userSchema.statics.signup = async function(email, password){

    // validator 

    if(!email || !password){
      throw Error("les champs email ou password sont vide")
    }

    if(!validator.isEmail(email)){
      throw Error("Email is not valid")
    }

    /*if(!validator.isStrongPassword(password)){
      throw Error("password is enough strong ")
    }*/

    const exists = await this.findOne({email}) ;
    
    if(exists){
        throw Error("email is already used")
    }

      // crypter le password 
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({email,password:hash})

    return user
}

module.exports = mongoose.model("User",userSchema)