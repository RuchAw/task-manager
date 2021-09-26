const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt= require("bcryptjs")
const jwt= require("jsonwebtoken")

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    },
    tokens: [{
        token:{
            type: String,
            required: true
        }    
    }]
})

//adding a new method to get authentication token
userSchema.methods.generateAuthToken = async function(){
    const user= this

    const token= jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)

    user.tokens= user.tokens.concat({ token })

    await user.save()

    return token
}


//adding a new model method to User model so we can find a user by its credentials
userSchema.statics.findByCredentials = async (email,password)=>{
    const user= await User.findOne({ email })

    if (!user) throw new Error("Unable to login")

    const isMatch= await bcrypt.compare(password, user.password)

    if (!isMatch) throw new Error("Unable to login")

    return user
}


//Hiding password and tokens from the response
userSchema.methods.toJSON= function (){
    const user= this
    const userObject= user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//Hashing the password before saving it
userSchema.pre("save", async function(next){
    const user= this

    if (user.isModified("password")){
        user.password= await bcrypt.hash(user.password,8)
    }
    
    next()
})

userSchema.virtual("tasks",{
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

const User = mongoose.model('User', userSchema)

module.exports = User