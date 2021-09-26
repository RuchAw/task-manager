const express=require("express")
const router= new express.Router()
const Task=require("../models/task")
const auth=require("../middleware/auth")

router.post("/tasks", auth, async(req,res)=>{
    const task= new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        task.save()
        res.status(201).send(task)
    }catch(err){
        res.status(400).send(err)
    }
})

router.get("/tasks", async(req,res)=>{
    try{
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    }catch(err){
        res.status(500).send()
    }
})

router.get("/tasks/:id", async(req,res)=>{
    const _id=req.params.id

    try{
        const task= await Task.findById(_id)

        if (!task) return res.status(404).send()

        res.status(200).send(task)
    }catch(err){
        res.status(500).send()
    }
})

router.patch("/tasks/:id", async (req,res)=>{

    const updates= Object.keys(req.body)
    const allowedUpdates= ["description","completed"]
    const isValidOperation= updates.every((update)=>allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send({error: "Updates are not allowed !"})

    try{     
        const task = await Task.findById(req.params.id)

        if (!task) return res.status(404).send()

        updates.forEach((update)=>{
            task[update]=req.body[update]
        })
        await task.save()

        res.send(task)
    }catch(error){
        res.status(500).send(error)
    }

})

router.delete("/tasks/:id", async(req,res)=>{
    try{
        const task= await Task.findOneAndDelete(req.params.id)

        if(!task) return res.status(404).send()

        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router