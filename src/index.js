const express = require('express');
require('./db/mongoose')
require('../config/dev.env')

const userRouter = require('./routes/user')
const taskRouter = require('./routes/task')

// require('./routes/user')
// require('./routes/task')
// const dotenv = require('dotenv')
// dotenv.config('.env')
const app = express();


const port = process.env.PORT;
// const multer = require('multer');

// const upload = multer({
//     dest: 'images'
// })

// app.post('/upload', upload.single('upload'),(req, res) =>{
//     res.send()
// })
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send("you are not allowed")
//     } else {
//         next()
//     }  
// })

// app.use((req, res, next) => {
//     res.status(503).send("Site is Under Maintainance")
// })
app.use(express.json()) 
app.use(userRouter)
app.use(taskRouter)



app.listen(port, () => {
    console.log(`connected on Port ${port}`);
})


// const bcrypt = require('bcryptjs')
// const check = async () => {
//     const pass = "Harry"
//     const hashedPwd = await bcrypt.hash(pass, 8)

//     console.log(pass)
//     console.log(hashedPwd) 

//     const isMatch = await bcrypt.compare("Harry", hashedPwd)
//     console.log(isMatch)
// }
// check()

// const jwt = require('jsonwebtoken')
// const check =  async () => {
//     const token = jwt.sign({ _id: 'abc123' }, "asdfg1234asdfsdfsdfsdfsdf",{expiresIn:"24 hours"})
//     console.log(token)
//     const data = jwt.verify(token,'asdfg1234asdfsdfsdfsdfsdf')
//     console.log(data)
// }

// check()

// const Task = require('./models/task')
// const User = require('./models/user')

// const check = async () => {
//     // const user = await Task.findById("603c10b5ae468524a4525d2f")
//     // await user.populate('user').execPopulate()
//     // console.log(user.user)
//     const user = await User.findById("603c9ebfae468524a4525d32")
//     // console.log(user.task)

//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// check()


