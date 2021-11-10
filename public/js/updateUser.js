const newUsername= document.querySelector(".newUsername")
const ageModify= document.querySelector(".ageModify")
const newPassword= document.querySelector(".newPassword")
const logOutAll= document.querySelector(".logOutAll")
const deleteUser= document.querySelector(".deleteUser")
const updateContent = document.querySelectorAll(".updateContent")
const updates= document.querySelectorAll(".update")
const updateUsernameButton= document.querySelector("#updateUsernameButton")
const newUsernameInput= document.querySelector("#newUsernameInput")
const ageModifyButton= document.querySelector("#ageModifyButton")
const ageModifyInput= document.querySelector("#ageModifyInput")
const updatePasswordButton= document.querySelector("#updatePasswordButton")
const newPasswordInput= document.querySelector("#newPasswordInput")
const newPasswordInputConfirm= document.querySelector("#newPasswordInputConfirm")
const logOutAllbutton= document.querySelector("#logOutAllbutton")
const deleteUserButton= document.querySelector("#deleteUserButton")



const backData=document.cookie
const data=backData.split(';')
const token=data.find(row => row.startsWith('Token='||" Token=")).split('=')[1]


updateUsernameButton.addEventListener("click",(e)=>{
    e.preventDefault()
    const myHeaders = new Headers()

    myHeaders.append("Authorization",`Bearer ${token}`)
    myHeaders.append("Content-Type", "application/json")

    const data = JSON.stringify({
        "name": newUsernameInput.value
    })

    const requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: data,
        redirect: 'follow'
    }

    fetch("http://localhost:3000/users/me", requestOptions)
    .then(response => response.text())
    .then(result => console.log("username updated"))
    .catch(error => console.log('error', error))

    location.reload()

})

let errorMessageAge= false

ageModifyButton.addEventListener("click",(e)=>{
    e.preventDefault()
    const myHeaders = new Headers()

    if(!ageModifyInput.value){
        if (!errorMessageAge){
            updateContent[2].insertAdjacentHTML("beforeend","<div>Please provide a valid age</div>")
            errorMessageAge= true
        }
        
    }else{
        myHeaders.append("Authorization",`Bearer ${token}`)
        myHeaders.append("Content-Type", "application/json")

        const data = JSON.stringify({
            "age": ageModifyInput.value
        })

        const requestOptions = {
            method: 'PATCH',
            headers: myHeaders,
            body: data,
            redirect: 'follow'
        }

        fetch("http://localhost:3000/users/me", requestOptions)
        .then(response => response.text())
        .then(result => console.log("age modified"))
        .catch(error => console.log('error', error))

        location.reload()

    }

    
})

let errorMessagePassword = false

updatePasswordButton.addEventListener("click",(e)=>{
    e.preventDefault()
    if(newPasswordInput.value.length< 6){
        if (!errorMessagePassword){
            updateContent[3].insertAdjacentHTML("beforeend","<div>Password must be at leas 6 characters</div>")
            errorMessagePassword = true
        }
    }else{
        if (newPasswordInput.value===newPasswordInputConfirm.value){
            const myHeaders = new Headers()
    
            myHeaders.append("Authorization",`Bearer ${token}`)
            myHeaders.append("Content-Type", "application/json")
    
            const data = JSON.stringify({
                "password": newPasswordInput.value
            })
    
            const requestOptions = {
                method: 'PATCH',
                headers: myHeaders,
                body: data,
                redirect: 'follow'
            }
    
            fetch("http://localhost:3000/users/me", requestOptions)
            .then(response => response.text())
            .then(result => console.log("password updated"))
            .catch(error => console.log('error', error))
    
            location.reload()
        }else{
            updateContent[3].insertAdjacentHTML("beforeend","<div>please confirm your password correctly</div>")
        }
    }
    
})

logOutAllbutton.addEventListener("click",e =>{
    e.preventDefault()
    const myHeaders = new Headers()
    
    myHeaders.append("Authorization",`Bearer ${token}`)

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    }

    fetch("http://localhost:3000/users/logoutALL", requestOptions)
        .then(response => response.text())
        .then(result => console.log("Disconnected from all devices"))
        .catch(error => console.log('error', error))

    document.cookie= "Token= ;expires = Thu, 01 Jan 1970 00:00:00 GMT"

    location.reload()
})

deleteUserButton.addEventListener("click", e=>{
    e.preventDefault()

    const myHeaders = new Headers()
    
    myHeaders.append("Authorization",`Bearer ${token}`)

    const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
    }

    fetch("http://localhost:3000/users/me", requestOptions)
        .then(response => response.text())
        .then(result => console.log("User deleted"))
        .catch(error => console.log('error', error))

    document.cookie= "Token= ;expires = Thu, 01 Jan 1970 00:00:00 GMT"

    location.reload()

})



updates.forEach((update,i)=>{
    update.addEventListener("click",()=>{
        updateContent.forEach(content=>{
            content.classList.add("hide")
        })
        updateContent[i+1].classList.remove("hide")
    })
})
