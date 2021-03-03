const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}).then(() => {
  console.log("connected")
}).catch((err) => {
  console.log(err)
})

// const Tasks = mongoose.model("Tasks", {
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const task = new Tasks({
//     description: "Testing check       ",
//     completed:true
// }).save().then((response) => {
//     console.log(response)
// }).catch((error) => {
//     console.log(error._message)
// })


// // const User = mongoose.model("User", {
// //   name: {
// //     type: String,
// //   },
// //   age: { type: Number },
// // });

// // const user = new User({
// //     name: "Harinder",
// //     age:6
// // });

// // user.save().then((response) => {
// // console.log(response);
// // }).catch((err) => {
// //     console.log(err._message);
// // })

// // const Tasks = mongoose.model("Tasks", {
// //   description: {
// //         type: String,
// //         trim:true,
// //         required: true
// //   },
// //     status: {
// //         type: Boolean,
// //         trim:true,
// //         // default: false
// //     },
// //     email: {
// //         type: String,
// //         required: true,
// //         trim: true,
// //         lowercase: true,
// //         validate(value) {
// //             if (!validator.isEmail(value)) {
// //                 throw new Error("Invaild Email")
// //             }
// //         }
// //     },
// //     password: {
// //         type: String,
// //         required: true,
// //         trim: true,
// //         validate(value) {
// //             if (value.length <= 6 || value.includes("Password", "passw0rd", "password123", "123password")) {
// //                 throw new Error("Invalid Password")
// //             }
// //         }
// //     }


// // });

// // const task = new Tasks({
// //     description: "Learning HTML",
// //     status: false,
// //     email: "singh.harinder45@gmail.com",
// //     password: "Harry@1234"
// // }).save().then((response) => {
// //     console.log(response);
// // }).catch((err) => {
// //     console.log(err._message);
// // })
