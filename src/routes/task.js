const Task = require("../models/task");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { ObjectID } = require("mongodb");

router.post("/tasks/create", auth, async (req, res) => {
  // const task = new Task(req.body)
  // task.user = req.user._id

  const task = new Task({
    ...req.body,
    user: req.user._id,
  });
  try {
    await task.save();
    const data = await Task.find({ user: ObjectID(req.user._id) });
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

router.patch("/tasks/:id", async (req, res) => {
  const requested = Object.keys(req.body);
  const allowed = ["description", "status"];
  const isAllowed = requested.every((request) => allowed.includes(request));
  if (!isAllowed) {
    return res.status(500).send("invalid inputs");
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      return res.status(404).send("Not Found");
    }
    res.send(task);
  } catch (error) {
    res.status(404).send(error);
  }
});

// router.get("/tasks/:status", async (req, res) => {
//   const status = req.params.status;
//   try {
//     const tasks = await Task.find({ status: status });
//     if (tasks.length == 0) {
//       return res.status(400).send("No Data Found");
//     } else {
//       res.send(tasks);
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });



router.get("/tasks/:id", auth, async (req, res) => {
    // const _id = req.params.id
    try {
        const data = await Task.findOne({_id:ObjectID(req.params.id),user:req.user._id});
        
    if (!data) {
      res.status(404).send("No Result Found")
    }
  res.send(data);
   
    } catch (error) {
        res.status(500).send(error);
    }
  
});

router.get('/tasks', auth, async (req, res) => {
    // const user = req.user._id
    const match = {}
    const sort ={}
    if (req.query.status) {
        match.status = req.query.status === "true"
    }
    if (req.query.sortby) {
        const parts = req.query.sortby.split(':')
        sort[parts[0]]=parts[1] ==='desc' ? -1:1
    } 
    try {
        // const data = await Task.find({ user: ObjectID(user) })
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort 
            }
        }).execPopulate()
        // if (!data) {
        //     res.send("No Post Found")
        // }
        res.send(req.user.tasks)
    } catch (error) {
        res.send(error);
    }
})

router.delete('tasks/:id', auth, async (req, res) => {
    try {
        await Task.findOneAndDelete({ _id: ObjectID(req.params.id), user: ObjectID(req.user._id) })
        res.send("Needful done")
    } catch (error) {
        res.send(error)
        
    }
})

module.exports = router;
