const express=require("express")
const router= new express.Router()
const path=require("path")
const hbs=require("hbs")
const bodyParser=require("body-parser")
const auth=require("../middleware/auth")
const {signIn}=require("./utils/signIn")
const {signingup}=require("./utils/signUp")
const {signOut}=require("./utils/signOut")
const cookieParser = require("cookie-parser")

router.use(cookieParser())

router.get("",(req,res)=>{
    
    if (req.cookies.Token) res.redirect("/userHomePage")
    else{
        res.render("index",{
            title: "Task manager",
            name: "Anas Belhaddad"
        })
    }
    
})

router.get("/signUp",(req,res)=>{

    if (req.cookies.Token){
        res.redirect("/userHomePage")
    }else{
        res.clearCookie("Token")
        res.clearCookie("Id")
        res.render("signUp",{
        title: "Register",
        name: "Anas Belhaddad"
    })
    }
    
})

router.get("/signIn",(req,res)=>{
    
    if (req.cookies.Token){
        res.redirect("/userHomePage")
    }else{
        res.clearCookie("Token")
        res.clearCookie("Id")
        res.render("signIn",{
            title: "Sign in",
            name: "Anas Belhaddad"
        })
    }
    
})

var userName= ""
var age= 0
var joinedOn= new Date().toLocaleDateString("en-US")

router.get("/userHomePage", (req,res)=>{

    if (req.cookies.Token){
        res.render("userHomePage",{
            title: `${userName} home page`,
            name: "Anas Belhaddad",
            user: `${userName}`,
            age: age,
            joinedOn: joinedOn,
        })
    }else{
        res.redirect("/signIn")
    }
    
})

router.get("/userTasks", (req,res)=>{
    if (req.cookies.Token){
    res.render("userTasks",{
        title: "Tasks",
        name: "Anas Belhaddad"
    })}else{
        res.redirect("/signIn")
    }
})

router.get("/about", (req,res)=>{
    res.render("about",{
        title: "About us",
        name: "Anas Belhaddad"
    }
    )
})

router.get("/userUpdate", (req,res)=>{
    if (req.cookies.Token){
        res.render("userUpdate",{
            user: `${userName}`,
            title: `Update user: ${userName}`
        })
    }else{
        res.redirect("/signIn")
    }
    
})

router.get("*",(req,res)=>{
    res.render("404",{
        title: "404 Page not found",
        message: "Page not found please try links below",
        name: "Anas Belhaddad"
    })
    
})


router.post("/signIn", async(req,res)=>{
   
    const response= await signIn(req.body.email,req.body.password)
    if (response.user){
        console.log(`logged in as user: ${response.user.name}`)
        userName=response.user.name
        age=response.user.age
        joinedOn=new Date(response.user.createdAt).toLocaleDateString("en-US")
        res.cookie("Token",response.token,{ maxAge: 604800000})
        res.cookie("Id",response.user._id,{ maxAge: 604800000})
        res.redirect("/userHomePage")
    }else{
        console.log("User not found")
        res.render("signIn",{
            title: "Sign in",
            name: "Anas Belhaddad",
            loginMessage: "User not found"
        })
    }
    
})

let signUpMessage=""

router.post("/signUp",async(req,res)=>{
    const response= await signingup(req.body.username,req.body.email,req.body.password,req.body.age)
    
    if (response.user){
        console.log(`User ${req.body.username} has been created, check your Email : ${req.body.email}`)
        userName=response.user.name
        age=response.user.age
        joinedOn=new Date(response.user.createdAt).toLocaleDateString("en-US")
        res.cookie("Token",response.token,{ maxAge: 604800000})
        res.cookie("Id",response.user._id,{ maxAge: 604800000})
        res.redirect("/userHomePage")
    }else if(response.errors){
        const keys=Object.keys(response.errors)
        keys.forEach(key=>{
            console.log(`Please provide a valid ${key}`)
            signUpMessage += " - Please provide a valid " + key
        })

        res.render("signUp",{
            title: "Register",
            name: "Anas Belhaddad",
            signUpMessage
        })
    }else{
        console.log("This email is already taken please use another mail to signup")
        signUpMessage = "This email is already taken please use another mail to signup"

        res.render("signUp",{
            title: "Register",
            name: "Anas Belhaddad",
            signUpMessage
        })
    }
    
})

router.post("/signOut", async(req,res)=>{
    const response = await signOut(req.cookies.Token)
    userName= ""
    res.clearCookie("Token")
    res.clearCookie("Id")
    res.redirect("/")
})



module.exports=router