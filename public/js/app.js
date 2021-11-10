const changeAvatar=document.querySelector(".changeAvatar")
const uploadPicture = document.querySelector("#uploadPicture")
const avatarForm=document.querySelector(".avatarForm")
const age= document.querySelector(".age")
const userName= document.querySelector(".userName")
const profileImage=document.querySelectorAll("img")[0]
const backData=document.cookie


const data=backData.split(';')

const token=data.find(row => row.startsWith('Token='||" Token=")).split('=')[1]

const id= data.find(row => row.startsWith(' Id='|| "Id=")).split('=')[1]

uploadPicture.onchange=()=>{

    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${token}`)

    const formdata = new FormData()
    formdata.append("avatar", uploadPicture.files[0])

    const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
    }

    fetch("https://ruchaw-tasks-manager.herokuapp.com/users/me/avatar", requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error))

    location.reload()

}


window.addEventListener("load",async ()=>{
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${token}`)

    const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    }

    try{
        const response = await fetch(`https://ruchaw-tasks-manager.herokuapp.com/users/${id}/avatar`, requestOptions)
        
        if(!response.ok) throw new Error(response.status)
        else{
            const blob= await response.blob()
            var objectURL = URL.createObjectURL(blob)
            profileImage.setAttribute('src', objectURL)
        }
        
    }catch(error){
        console.log(error)
    }
    
})

window.addEventListener("load",async()=>{
    const myHeaders = new Headers()
    myHeaders.append("Authorization", `Bearer ${token}`)

    const requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
    }

    try{
        const response = await fetch(`https://ruchaw-tasks-manager.herokuapp.com/users/me`, requestOptions)
            const userJson= await response.text()
            const user= JSON.parse(userJson)

            age.innerHTML= `Age: ${user.age}`
            userName.innerHTML= user.name
        
    }catch(error){
        console.log(error)
    }

})
