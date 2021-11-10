const axios = require('axios')



const signIn= async(email,password)=>{

    const data = JSON.stringify({
        "email": email,
        "password": password
      });
      
      const config = {
        method: 'post',
        url: 'https://ruchaw-tasks-manager.herokuapp.com/users/login',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      }
      
      try{
        const response = await axios(config)
        return response.data
        
      }catch(error){
        return error.response.data
      }
     
}

module.exports={
    signIn
}
