const pendingTasks= document.querySelector(".pendingTasks")
const complete= document.querySelector(".complete")
const pending= document.querySelector(".pending")
const state= document.querySelector(".state")
const updateUser= document.querySelector("#updateUser")


const fetchTasks= async()=>{
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${token}`)

    const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    }
    try{
        const response = await fetch("https://ruchaw-tasks-manager.herokuapp.com/tasks", requestOptions)
        const result= await response.text()
        const tasks=JSON.parse(result)
        uncompletedTasks=tasks.filter(task => task.completed === false)
        pendingTasks.innerHTML= `Pending tasks: ${uncompletedTasks.length}`
        pending.innerHTML = uncompletedTasks.length
        complete.innerHTML = tasks.length - uncompletedTasks.length
    }catch(error){
        console.log(error)
    }
    
}

fetchTasks()

pending.addEventListener("click",()=>{
    location.href="https://ruchaw-tasks-manager.herokuapp.com/userTasks"
})

complete.addEventListener("click",()=>{
    location.href="https://ruchaw-tasks-manager.herokuapp.com/userTasks"
})

updateUser.addEventListener("click",()=>{
    location.href="https://ruchaw-tasks-manager.herokuapp.com/userUpdate"
})