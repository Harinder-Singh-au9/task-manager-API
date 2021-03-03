const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task")
const welcomeMail = require('../emails/accounts')
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email")
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.includes("password")) {
                throw new Error("Invalid Password")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error("Invalid Age")
            }
        }
        
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.methods.getpublicprofile = async function ()  {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.avatar
    delete userObject.tokens
    return userObject

}

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField:'user'
})

// userSchema.methods.sendMail = async function () {
//     const user = this
//     try {
//         await welcomeMail(user.email,user.name)
//         res.send("Welcome")
//     } catch (error) {
//         res.send(error)
//     }
// }

// userSchema.methods.unsubscribeMail = () => {
//     const user = this
//     goodbyeMail(user.email,user.name)
// }

userSchema.methods.getToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'asdfghjkl123456asdfghjkl')
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}
userSchema.statics.getUserCreditionals = async (email, password) => {
     
    const user = await User.findOne({ email })
    
    if (!user) {
        throw new Error("Invalid User")
    }

    const passwordcheck = await bcrypt.compare(password, user.password)
    
    if (!passwordcheck) {
        throw new Error("Invalid Password")
    }
    
    return user;
    
    
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})


userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({user:user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User; 