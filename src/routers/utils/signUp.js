const axios = require('axios')

const signingup = async(username,email,password,age=0)=>{
    const data = JSON.stringify({
        "name": username,
        "email": email,
        "password": password,
        "age": age
      })
      
      const config = {
        method: 'post',
        url: 'https://ruchaw-tasks-manager.herokuapp.com/users',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      }
      
      try{
        const response= await axios(config)
        return response.data

      }catch(error){
          return error.response.data
      }
      
}

module.exports={
    signingup
}

