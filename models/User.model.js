const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
   name : {
          type:String,
          required:true,
          trim:true
   },
   email:{
          type:String,
          required:true,
          unique:true,
          trim:true,
   },
   password:{
        type:String,
        required:true,
   },
   role:{
    type:String,
    enum:['customer' , 'admin'],
    default:'customer'
   }
},
{ timestamps: true } 
);


// password hashing befor saveing it to mongodb 
userSchema.pre('save' , async function (next) {
    if(!this.isModified('password')) return next();
    const salt = await bcrypt.getSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
    next();
})


// match or check password is correct

userSchema.method.matchPassword = async function (enterdPassword) {
    return await bcrypt.compare(enterdPassword , this.password);
}


// export user module using commonjs
module.exports = mongoose.model('User' , userSchema);