const axios = require('axios')


const signOut = async(token)=>{
    const config = {
        method: 'post',
        url: 'https://ruchaw-tasks-manager.herokuapp.com/users/logout',
        headers: { 
          'Authorization':  `Bearer ${token}`
        }
      }

      try{
        const response= await axios(config)
        return response
      }catch(error){
          return error
      }
}

module.exports={
    signOut
}

