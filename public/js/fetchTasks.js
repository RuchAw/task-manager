const tasksContainer= document.querySelector(".tasksContainer")
const completedTasksContainer= document.querySelector(".completedTasks")
const uncompletedTasksContainer= document.querySelector(".uncompletedTasks")
const createTask= document.querySelector("#createTask")
const createTaskForm= document.querySelector(".createTaskForm")
const taskDescription= document.querySelector("#taskDescription")
const createTaskButton= document.querySelector("#createTaskButton")
const taskModification= document.querySelector("#taskModification")
const modifyTaskForm= document.querySelector(".modifyTaskForm")
const modifyTaskButton= document.querySelector("#modifyTaskButton")


const backData=document.cookie
const data=backData.split(';')
const token=data.find(row => row.startsWith('Token='||" Token=")).split('=')[1]

let activeId=""
let activeDiv=""

const fetchTasks= async()=>{
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${token}`)

    const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    }
    try{
        const response = await fetch("http://localhost:3000/tasks", requestOptions)
        const result= await response.text()
        const tasks=JSON.parse(result)
        
        tasks.forEach(task => {
            
            const div=createTaskDiv(task,token)

            div.addEventListener("click",e=>{
                activeId= task._id
                activeDiv= div
            })

            if (task.completed) {
                div.classList.add("completed")
                div.children[3].removeChild(div.children[3].firstChild)
                completedTasksContainer.appendChild(div)
            }
            else {
                div.classList.add("uncompleted")
                uncompletedTasksContainer.appendChild(div)
            }
        }
        )
    }catch(error){
        console.log(error)
    }
    
}

fetchTasks()

let activeCreate= false

createTask.addEventListener("click",()=>{
    createTaskForm.classList.add("opacity")
    activeCreate = true
    taskDescription.focus()
})

let activeModify = false

let errorMessageCreate = false

createTaskButton.addEventListener("click",async(e)=>{
    e.preventDefault()

    if(taskDescription.value.length < 4 ){
        if (!errorMessageCreate){
            createTaskForm.insertAdjacentHTML("beforeend","<div>The task must be at least 4 characters long</div>")
            errorMessageCreate= true
        }
    }else{
        const myHeaders = new Headers()
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
        "description": taskDescription.value,
        "completed": false
        })

        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
        }

        const response = await fetch("http://localhost:3000/tasks", requestOptions)
        const result= await response.text()
        const task=JSON.parse(result)

        const div=createTaskDiv(task,token)
        div.classList.add("uncompleted")

        div.addEventListener("click",e=>{
            activeId= task._id
            activeDiv= div
        })

        uncompletedTasksContainer.appendChild(div)
        taskDescription.value=""
        createTaskForm.classList.remove("opacity")

        if(errorMessageCreate) createTaskForm.removeChild(createTaskForm.children[3])
        errorMessageCreate = false
        
    }
    
})


const createTaskDiv= (task,tok)=>{

    const title = task.description
    const id= task._id

    let div= document.createElement("div")

    let deleteDiv= document.createElement("form")
    let modifyDiv= document.createElement("form")
    let titleDiv= document.createElement("div")
    let doneDiv= document.createElement("form")

    let deleteIcon= document.createElement("input")
    let modifyIcon= document.createElement("input")
    let doneIcon= document.createElement("input")

    deleteIcon.addEventListener("click",(e)=>{
        e.preventDefault()
        const myHeaders = new Headers()
        myHeaders.append("Authorization", `Bearer ${tok}`)

        const requestOptionsDelete = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
          }
          
          fetch(`http://localhost:3000/tasks/${id}`, requestOptionsDelete)
            .then(response => response.text())
            .then(result => console.log("task deleted"))
            .catch(error => console.log('error', error))

        div.parentNode.removeChild(div)
    })

    doneIcon.addEventListener("click",(e)=>{
        e.preventDefault()
        const myHeaders = new Headers()
        myHeaders.append("Authorization", `Bearer ${tok}`)
        myHeaders.append("Content-Type", "application/json")
        var raw = JSON.stringify({
            "completed": "true"
          })

        const requestOptionsDone = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          }

        fetch(`http://localhost:3000/tasks/${id}`, requestOptionsDone)
        .then(response => response.text())
        .then(result => console.log("task done"))
        .catch(error => console.log('error', error))

        div.parentNode.removeChild(div)

        div.classList.remove("uncompleted")
        div.classList.add("completed")
        div.children[3].removeChild(div.children[3].firstChild)

        // div.children[0].classList.add("hide")
        // div.children[1].classList.add("hide")
                
        completedTasksContainer.appendChild(div)

    })

    modifyIcon.addEventListener("click",(e)=>{
        e.preventDefault()
        modifyTaskForm.classList.add("opacity")
        activeModify = true
        taskModification.focus()
    })

    deleteDiv.classList.add("delete")
    modifyDiv.classList.add("modify")
    titleDiv.classList.add("title")
    doneDiv.classList.add("done")


    deleteIcon.classList.add("deleteIcon")
    modifyIcon.classList.add("modifyIcon")
    doneIcon.classList.add("doneIcon")

    deleteIcon.setAttribute("type","submit")
    modifyIcon.setAttribute("type","submit")
    doneIcon.setAttribute("type","submit")

    deleteIcon.setAttribute("value","")
    modifyIcon.setAttribute("value","")
    doneIcon.setAttribute("value","")

    deleteDiv.classList.add("hide")
    modifyDiv.classList.add("hide")
    doneDiv.classList.add("hide")

    deleteDiv.appendChild(deleteIcon)
    modifyDiv.appendChild(modifyIcon)
    doneDiv.appendChild(doneIcon)

    div.appendChild(deleteDiv)
    div.appendChild(modifyDiv)
    div.appendChild(titleDiv)
    div.appendChild(doneDiv)

    titleDiv.innerHTML= title

    div.classList.add("task")

    div.addEventListener("click",()=>{
        
        const tasksDivs= document.querySelectorAll(".task")

        tasksDivs.forEach(taskDiv=>{
            taskDiv.children[0].classList.add("hide")
            taskDiv.children[1].classList.add("hide")
            taskDiv.children[3].classList.add("hide")
        })

        deleteDiv.classList.remove("hide")
        modifyDiv.classList.remove("hide")
        doneDiv.classList.remove("hide")

        activeId= task._id
    })

    return div
}


window.addEventListener('mouseup', (e)=>{
    if((e.target != createTaskForm && e.target.parentNode != createTaskForm) && activeCreate){
        createTaskForm.classList.remove("opacity")
        activeCreate = false
    }
})

window.addEventListener('mouseup', (e)=>{
    if((e.target != modifyTaskForm && e.target.parentNode != modifyTaskForm) && activeModify){
        modifyTaskForm.classList.remove("opacity")
        activeModify = false
    }
})

let errorMessageModify= false

modifyTaskButton.addEventListener("click",(e)=>{
    e.preventDefault()

    if(taskModification.value.length < 4){
        if(!errorMessageModify){
            modifyTaskForm.insertAdjacentHTML("beforeend","<div>The task must be at least 4 characters long</div>")
            errorMessageModify= true
        }
    }else{
        const myHeaders = new Headers()
        myHeaders.append("Authorization", `Bearer ${token}`)
        myHeaders.append("Content-Type", "application/json")
        var raw = JSON.stringify({
            "description": taskModification.value
            })

        const requestOptionsModify = {
            method: 'PATCH',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            }
        
        fetch(`http://localhost:3000/tasks/${activeId}`, requestOptionsModify)
        .then(response => response.text())
        .then(result => console.log("task modified"))
        .catch(error => console.log('error', error))
     
    activeDiv.children[2].innerHTML= taskModification.value
        
    taskModification.value=""
    modifyTaskForm.classList.remove("opacity")

    if(errorMessageModify) modifyTaskForm.removeChild(modifyTaskForm.children[3])
    errorMessageModify= false
    }

})



