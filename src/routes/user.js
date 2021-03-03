const User = require("../models/user");
const {welcomeMail,goodByeMail} = require("../emails/accounts")
const express = require("express");
const router = express.Router(); 
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require("sharp")
const avatar = multer({
  limits: {
    fileSize:1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error("Please upload a PDF file"))
    }
    cb(null,true)
  }
})

router.post("/users/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    await user.getToken();
    welcomeMail(user.email,user.name)
    // const userprofile =  await user.getpublicprofile()
    res.status(200).send(user);
  } catch (error) {
    res.send(error);
  }
}); 

router.post('/users/me/avatar',auth, avatar.single('avatar'), async (req, res) => {
  // req.user.avatar = req.file.buffer 
  const buffer = await sharp(req.file.buffer).resize({ height: 250, width: 250 }).png().toBuffer()
  
  req.user.avatar = buffer
  await req.user.save();
  res.send("needful done")
}, (error, req, res, next)=>{
    res.status(404).send({
      error: error.message
    })
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      return new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
    
  } catch (error) {
    res.send(error)
  }

})

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save();
  res.send("Needful Done")
})

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.getUserCreditionals(
      req.body.email,
      req.body.password
    );
    
  //   if (!user) {
  //     return res.send("Invalid User")
  // }
  
    // console.log(user)
    const token = await user.getToken();
    // // console.log(token)
    
    // const userData = await user.getpublicprofile()
    // if (!userData) {
    //   res.send("No User Found")
    // }
    res.send({token:token});
    // res.send(user);
  } catch (error) {
    res.send(error);
  }
});

router.post('/users/logout', auth ,async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token!==req.token
    })
    await req.user.save()
    res.send()

  } catch (error) {
    res.send(error);
  }
})
router.post('/users/logoutAll', auth ,async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.status(200).send()

  } catch (error) {
    res.send(error);
  }
})
router.patch("/users/me",auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "password", "age", "email"];

  const isAllowed = updates.every((update) => allowedUpdates.includes(update));
  if (!isAllowed) {
    return res.send("invalid");
  }
  try {
    // const user = await User.findById(req.user.id);
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const update = await User.findByIdAndUpdate(req.params.id, req.body,{runValidators:true,new:true})
    res.send(req.user);
   
  } catch (error) {
    res.send(error);
  }
});

router.get("/users/me", auth, async (req, res) => {
  try {
    const profile = await req.user.getpublicprofile()
    res.send(profile)
    
  } catch (error) {
    res.send(error)
  }
  
});

router.delete('/users/me', auth, async (req, res) => {
  try {

    goodByeMail(req.user.email,req.user.name)
    await req.user.remove()
    res.send("Needful done")
    // const user = await User.findByIdAndUpdate(req.user._id)
    // user.delete()
    // res.send("NeedFul Done")
  } catch (error) {
    res.send("Failed to Delete")
  }
  
})

// router.get("/users/:id", async (req, res) => {
//   const id = req.params.id;
//   try {
//     const user = await User.findById(id);
//     res.send(user);
//   } catch (error) {
//     res.send(error);
//   }
// });

module.exports = router;
