const express= require("express")
require("./db/mongoose")
const path=require("path")
const hbs=require("hbs")
const bodyParser=require("body-parser")
const userRouter= require("./routers/user")
const taskRouter= require("./routers/task")
const frontRouter= require("./routers/front")


const app = express()

app.use(bodyParser.urlencoded({extended: true}))

const port= process.env.PORT || 3000

//define paths for Express config

const publicDirectorypath=path.join(__dirname,'../public')
const viewsPath=path.join(__dirname,"../templates/views")
const partialsPath=path.join(__dirname,"../templates/partials")

// Setup handlebars engine and views location   
app.set("view engine","hbs")
app.set("views",viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirectorypath))

app.use(express.json())

app.use(userRouter)

app.use(taskRouter)

app.use(frontRouter)



app.listen(port, ()=>{
    console.log("Server is up on port " + port)
})